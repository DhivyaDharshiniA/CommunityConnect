//package com.example.springapp.controller;
//
//import com.example.springapp.dto.MyVolunteerDTO;
//import com.example.springapp.entity.*;
//import com.example.springapp.repository.*;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.core.userdetails.UserDetails;
//
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/volunteers")
//@CrossOrigin(origins = "*")
//public class VolunteerController {
//
//    @Autowired
//    private VolunteerRepository volunteerRepo;
//
//    @Autowired
//    private EventRepository eventRepo;
//
//    @Autowired
//    private UserRepository userRepo;
//
//    // ---------------- REGISTER FOR EVENT ----------------
//
//    @PostMapping("/register/{eventId}")
//    public ResponseEntity<?> registerVolunteer(
//            @PathVariable Long eventId,
//            @RequestBody VolunteerRegistration request,
//            @AuthenticationPrincipal UserDetails userDetails) {
//
//        try {
//
//            User user = userRepo.findByEmail(userDetails.getUsername())
//                    .orElseThrow(() -> new RuntimeException("User not found"));
//
//            Event event = eventRepo.findById(eventId)
//                    .orElseThrow(() -> new RuntimeException("Event not found"));
//
//            if (volunteerRepo.findByEventIdAndUserId(eventId, user.getId()).isPresent()) {
//                return ResponseEntity.badRequest().body("You already registered.");
//            }
//
//            VolunteerRegistration registration = new VolunteerRegistration();
//
//            registration.setSkills(request.getSkills());
//            registration.setAvailability(request.getAvailability());
//            registration.setMessage(request.getMessage());
//
//            registration.setEvent(event);
//            registration.setUser(user);
//
//            registration.setStatus("PENDING");
//
//            // ⭐ CALCULATE SCORE
//            int score = calculateScore(event.getDescription(), request.getSkills());
//            registration.setScore(score);
//
//            volunteerRepo.save(registration);
//
//            return ResponseEntity.ok("Request has been sent to the event organiser");
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(500).body("Registration failed");
//        }
//    }
//
//    // ---------------- GET VOLUNTEERS FOR EVENT ----------------
//    @GetMapping("/event/{eventId}")
//    public ResponseEntity<?> getVolunteersByEvent(
//            @PathVariable Long eventId,
//            @AuthenticationPrincipal UserDetails userDetails) {
//
//        try {
//            Event event = eventRepo.findById(eventId)
//                    .orElseThrow(() -> new RuntimeException("Event not found"));
//
//            // Only creator can view
//            if (!event.getCreatedBy().getEmail()
//                    .equals(userDetails.getUsername())) {
//                return ResponseEntity.status(403)
//                        .body("Not authorized");
//            }
//
//            List<VolunteerRegistration> volunteers =
//                    volunteerRepo.findByEventId(eventId);
//
//            return ResponseEntity.ok(volunteers);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(500)
//                    .body("Error fetching volunteers");
//        }
//    }
//
//    // ---------------- APPROVE / REJECT ----------------
//    @PutMapping("/update-status/{id}")
//    public ResponseEntity<?> updateStatus(
//            @PathVariable Long id,
//            @RequestParam String status,
//            @AuthenticationPrincipal UserDetails userDetails) {
//
//        try {
//            VolunteerRegistration registration =
//                    volunteerRepo.findById(id)
//                            .orElseThrow(() -> new RuntimeException("Not found"));
//
//            Event event = registration.getEvent();
//
//            if (!event.getCreatedBy().getEmail()
//                    .equals(userDetails.getUsername())) {
//                return ResponseEntity.status(403)
//                        .body("Not authorized");
//            }
//
//            registration.setStatus(status);
//            volunteerRepo.save(registration);
//
//            return ResponseEntity.ok("Status updated");
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(500)
//                    .body("Error updating status");
//        }
//    }
//    @GetMapping("/my-registrations")
//    public ResponseEntity<?> getMyRegistrations(
//            @AuthenticationPrincipal UserDetails userDetails) {
//
//        User user = userRepo.findByEmail(userDetails.getUsername())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        return ResponseEntity.ok(
//                volunteerRepo.findByUserId(user.getId())
//        );
//    }
//    private int calculateScore(String description, String skills) {
//
//        if (description == null || skills == null) return 0;
//
//        String[] eventWords = description.toLowerCase().split("[,\\s]+");
//        String[] skillWords = skills.toLowerCase().split("[,\\s]+");
//
//        int score = 0;
//
//        for (String skill : skillWords) {
//            for (String word : eventWords) {
//                if (skill.trim().equals(word.trim())) {
//                    score++;
//                }
//            }
//        }
//
//        return score;
//    }
//
//    @GetMapping("/my-volunteers")
//    public ResponseEntity<?> getMyVolunteers(
//            @AuthenticationPrincipal UserDetails userDetails) {
//
//        User ngo = userRepo.findByEmail(userDetails.getUsername())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        List<VolunteerRegistration> registrations =
//                volunteerRepo.findAllByNgoEvents(ngo.getId());
//
//        Map<Long, MyVolunteerDTO> map = new HashMap<>();
//
//        for (VolunteerRegistration vr : registrations) {
//
//            User user = vr.getUser();
//
//            map.putIfAbsent(user.getId(),
//                    new MyVolunteerDTO(
//                            user.getName(),
//                            user.getEmail(),
//                            new ArrayList<>(),
//                            new ArrayList<>(),
//                            0L
//                    )
//            );
//
//            MyVolunteerDTO dto = map.get(user.getId());
//
//            dto.getAppliedEvents().add(vr.getEvent().getTitle());
//            dto.getSkills().add(vr.getSkills());
//
//            dto.setTotalEventsRegistered(
//                    dto.getTotalEventsRegistered() + 1
//            );
//        }
//
//        return ResponseEntity.ok(map.values());
//    }
//}


package com.example.springapp.controller;

import com.example.springapp.dto.MyVolunteerDTO;
import com.example.springapp.entity.*;
import com.example.springapp.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.*;
import java.util.stream.Collectors;

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

    // ================= REGISTER FOR EVENT =================
    @PostMapping("/register/{eventId}")
    public ResponseEntity<?> registerVolunteer(
            @PathVariable Long eventId,
            @RequestBody VolunteerRegistration request,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            User user = getLoggedUser(userDetails);
            Event event = getEvent(eventId);

            // Prevent duplicate registration
            if (volunteerRepo.findByEventIdAndUserId(eventId, user.getId()).isPresent()) {
                return ResponseEntity.badRequest().body("Already registered for this event");
            }

            VolunteerRegistration registration = new VolunteerRegistration();
            registration.setUser(user);
            registration.setEvent(event);
            registration.setSkills(request.getSkills());
            registration.setAvailability(request.getAvailability());
            registration.setMessage(request.getMessage());
            registration.setStatus("PENDING");

            // 🔥 Dynamic Score Calculation
            int score = calculateScore(event.getDescription(), request.getSkills());
            registration.setScore(score);

            volunteerRepo.save(registration);

            return ResponseEntity.ok(Map.of(
                    "message", "Registration successful",
                    "score", score
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Registration failed: " + e.getMessage());
        }
    }

    // ================= GET VOLUNTEERS FOR EVENT =================
    @GetMapping("/event/{eventId}")
    public ResponseEntity<?> getVolunteersByEvent(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            Event event = getEvent(eventId);

            if (!isOwner(event, userDetails)) {
                return ResponseEntity.status(403).body("Access denied");
            }

            List<VolunteerRegistration> volunteers =
                    volunteerRepo.findByEventId(eventId);

            // 🔥 Sort by score (best volunteers first)
            volunteers.sort(Comparator.comparingInt(VolunteerRegistration::getScore).reversed());

            return ResponseEntity.ok(volunteers);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching volunteers");
        }
    }

    // ================= APPROVE / REJECT =================
    @PutMapping("/update-status/{id}")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            VolunteerRegistration reg = volunteerRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Registration not found"));

            if (!isOwner(reg.getEvent(), userDetails)) {
                return ResponseEntity.status(403).body("Access denied");
            }

            reg.setStatus(status.toUpperCase());
            volunteerRepo.save(reg);

            return ResponseEntity.ok(Map.of(
                    "message", "Status updated",
                    "newStatus", reg.getStatus()
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Update failed");
        }
    }

    // ================= MY REGISTRATIONS =================
    @GetMapping("/my-registrations")
    public ResponseEntity<?> getMyRegistrations(
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            User user = getLoggedUser(userDetails);

            List<VolunteerRegistration> list =
                    volunteerRepo.findByUserId(user.getId());

            return ResponseEntity.ok(list);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching registrations");
        }
    }

    // ================= NGO DASHBOARD VIEW =================
    @GetMapping("/my-volunteers")
    public ResponseEntity<?> getMyVolunteers(
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            User ngo = getLoggedUser(userDetails);

            List<VolunteerRegistration> registrations =
                    volunteerRepo.findAllByNgoEvents(ngo.getId());

            Map<Long, MyVolunteerDTO> map = new HashMap<>();

            for (VolunteerRegistration vr : registrations) {

                User user = vr.getUser();

                map.putIfAbsent(user.getId(),
                        new MyVolunteerDTO(
                                user.getName(),
                                user.getEmail(),
                                new ArrayList<>(),
                                new ArrayList<>(),
                                0L
                        )
                );

                MyVolunteerDTO dto = map.get(user.getId());

                dto.getAppliedEvents().add(vr.getEvent().getTitle());
                dto.getSkills().add(vr.getSkills());

                dto.setTotalEventsRegistered(
                        dto.getTotalEventsRegistered() + 1
                );
            }

            return ResponseEntity.ok(map.values());

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error loading volunteers");
        }
    }

    // ================= FILTER VOLUNTEERS (NEW FEATURE) =================
    @GetMapping("/filter")
    public ResponseEntity<?> filterVolunteers(
            @RequestParam String skill) {

        List<VolunteerRegistration> filtered =
                volunteerRepo.findAll().stream()
                        .filter(v -> v.getSkills() != null &&
                                v.getSkills().toLowerCase().contains(skill.toLowerCase()))
                        .collect(Collectors.toList());

        return ResponseEntity.ok(filtered);
    }

    // ================= HELPER METHODS =================

    private User getLoggedUser(UserDetails userDetails) {
        return userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Event getEvent(Long eventId) {
        return eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    private boolean isOwner(Event event, UserDetails userDetails) {
        return event.getCreatedBy().getEmail()
                .equals(userDetails.getUsername());
    }

    // ================= SMART SCORE CALCULATION =================
    private int calculateScore(String description, String skills) {

        if (description == null || skills == null) return 0;

        Set<String> eventWords = new HashSet<>(
                Arrays.asList(description.toLowerCase().split("[,\\s]+"))
        );

        String[] skillWords = skills.toLowerCase().split("[,\\s]+");

        int score = 0;

        for (String skill : skillWords) {
            if (eventWords.contains(skill.trim())) {
                score++;
            }
        }

        return score;
    }
}