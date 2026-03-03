package com.example.springapp.controller;

import com.example.springapp.entity.*;
import com.example.springapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

@RestController
@RequestMapping("/api/volunteers")
@CrossOrigin(origins = "*")
public class VolunteerController {

    @Autowired
    private VolunteerRepository volunteerRepo;

    @Autowired
    private EventRepository eventRepo;

    @Autowired
    private UserRepository userRepo;

    // ---------------- REGISTER FOR EVENT ----------------
    @PostMapping("/register/{eventId}")
    public ResponseEntity<?> registerVolunteer(
            @PathVariable Long eventId,
            @RequestBody VolunteerRegistration request,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            User user = userRepo.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Event event = eventRepo.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            // Prevent duplicate registration
            if (volunteerRepo.findByEventIdAndUserId(eventId, user.getId()).isPresent()) {
                return ResponseEntity.badRequest()
                        .body("You already registered for this event.");
            }

            VolunteerRegistration registration = new VolunteerRegistration();
            registration.setSkills(request.getSkills());
            registration.setAvailability(request.getAvailability());
            registration.setMessage(request.getMessage());
            registration.setEvent(event);
            registration.setUser(user);
            registration.setStatus("PENDING");

            volunteerRepo.save(registration);

            return ResponseEntity.ok("Registered successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Registration failed");
        }
    }

    // ---------------- GET VOLUNTEERS FOR EVENT ----------------
    @GetMapping("/event/{eventId}")
    public ResponseEntity<?> getVolunteersByEvent(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            Event event = eventRepo.findById(eventId)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            // Only creator can view
            if (!event.getCreatedBy().getEmail()
                    .equals(userDetails.getUsername())) {
                return ResponseEntity.status(403)
                        .body("Not authorized");
            }

            List<VolunteerRegistration> volunteers =
                    volunteerRepo.findByEventId(eventId);

            return ResponseEntity.ok(volunteers);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error fetching volunteers");
        }
    }

    // ---------------- APPROVE / REJECT ----------------
    @PutMapping("/update-status/{id}")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            VolunteerRegistration registration =
                    volunteerRepo.findById(id)
                            .orElseThrow(() -> new RuntimeException("Not found"));

            Event event = registration.getEvent();

            if (!event.getCreatedBy().getEmail()
                    .equals(userDetails.getUsername())) {
                return ResponseEntity.status(403)
                        .body("Not authorized");
            }

            registration.setStatus(status);
            volunteerRepo.save(registration);

            return ResponseEntity.ok("Status updated");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error updating status");
        }
    }
    @GetMapping("/my-registrations")
    public ResponseEntity<?> getMyRegistrations(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(
                volunteerRepo.findByUserId(user.getId())
        );
    }

}