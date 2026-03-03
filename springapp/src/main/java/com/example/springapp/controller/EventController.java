package com.example.springapp.controller;

import com.example.springapp.entity.Event;
import com.example.springapp.entity.User;
import com.example.springapp.repository.EventRepository;
import com.example.springapp.repository.UserRepository;
import com.example.springapp.service.QRCodeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventRepository eventRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private QRCodeService qrService;

    // -------------------- CREATE EVENT --------------------
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createEvent(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam String venue,
            @RequestParam String city,
            @RequestParam String state,
            @RequestParam String organizerName,
            @RequestParam String contactEmail,
            @RequestParam String contactPhone,
            @RequestParam String startDateTime,
            @RequestParam String endDateTime,
            @RequestParam String requirements,
            @RequestParam String benefits,
            @RequestParam(required = false) MultipartFile bannerImage
    ) {

        try {

            User user = userRepo.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String fileName = null;

            if (bannerImage != null && !bannerImage.isEmpty()) {
                String uploadDir = "uploads/";
                Files.createDirectories(Paths.get(uploadDir));

                fileName = System.currentTimeMillis() + "_" +
                        bannerImage.getOriginalFilename();

                Path filePath = Paths.get(uploadDir + fileName);
                Files.write(filePath, bannerImage.getBytes());
            }

            Event event = new Event();
            event.setTitle(title);
            event.setDescription(description);
            event.setCategory(category);
            event.setVenue(venue);
            event.setCity(city);
            event.setState(state);
            event.setOrganizerName(organizerName);
            event.setContactEmail(contactEmail);
            event.setContactPhone(contactPhone);
            event.setStartDateTime(LocalDateTime.parse(startDateTime));
            event.setEndDateTime(LocalDateTime.parse(endDateTime));
            event.setRequirements(requirements);
            event.setBenefits(benefits);

            if (fileName != null) {
                event.setBannerImage("http://localhost:8080/uploads/" + fileName);
            }

            // 🔥 IMPORTANT LINE
            event.setCreatedBy(user);

            eventRepo.save(event);

            return ResponseEntity.ok("Event created successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating event");
        }
    }
    // -------------------- GET ALL EVENTS (PUBLIC) --------------------
    @GetMapping("/all")
    public ResponseEntity<List<Event>> getAllEvents() {
        try {
            return ResponseEntity.ok(eventRepo.findAll());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    // -------------------- GET MY EVENTS --------------------
    @GetMapping("/my")
    public ResponseEntity<?> getMyEvents(
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            User user = userRepo.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Event> myEvents = eventRepo.findByCreatedBy(user);
            return ResponseEntity.ok(myEvents);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching your events");
        }
    }
    // -------------------- GET EVENTS BY OTHERS --------------------
    @GetMapping("/others")
    public ResponseEntity<?> getOtherEvents(
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            User user = userRepo.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Event> events =
                    eventRepo.findByCreatedByIdNot(user.getId());

            return ResponseEntity.ok(events);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Error fetching events");
        }
    }

    // -------------------- GET EVENT BY ID --------------------
    // -------------------- GET EVENT BY ID (PUBLIC TO AUTHENTICATED USERS) --------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        try {
            Event event = eventRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            // Remove any sensitive info if needed, e.g. QR code for admin only
            return ResponseEntity.ok(event);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(404).body("Event not found");
        }
    }
}