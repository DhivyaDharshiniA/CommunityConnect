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
            @RequestParam int noOfVol,
            @RequestParam(required = false) MultipartFile bannerImage
    ) {

        try {

            // 🔹 Get logged-in user
            User user = userRepo.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String fileName = null;

            // 🔹 Handle banner upload
            if (bannerImage != null && !bannerImage.isEmpty()) {
                String uploadDir = "uploads/";
                Files.createDirectories(Paths.get(uploadDir));

                fileName = System.currentTimeMillis() + "_" +
                        bannerImage.getOriginalFilename();

                Path filePath = Paths.get(uploadDir + fileName);
                Files.write(filePath, bannerImage.getBytes());
            }

            // 🔹 Create event object
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
            event.setNoOfVol(noOfVol);

            if (fileName != null) {
                event.setBannerImage("http://localhost:8080/uploads/" + fileName);
            }

            // 🔥 IMPORTANT
            event.setCreatedBy(user);

            // ================================
            // ✅ STEP 1: SAVE EVENT FIRST
            // ================================
            Event savedEvent = eventRepo.save(event);

            // ================================
            // ✅ STEP 2: GENERATE QR CODE
            // ================================
            String qrFileName = qrService.generateQRCode(savedEvent.getId());

            // ================================
            // ✅ STEP 3: SAVE QR PATH
            // ================================
            String qrPath = "http://localhost:8080/qrcodes/" + qrFileName;
            savedEvent.setQrCodePath(qrPath);

            eventRepo.save(savedEvent);

            // ================================
            return ResponseEntity.ok(savedEvent);

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



    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userRepo.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Event event = eventRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            // Only the creator can delete their own event
            if (!event.getCreatedBy().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You are not authorized to delete this event");
            }

            // Optionally delete the banner image file from disk
            if (event.getBannerImage() != null) {
                try {
                    String fileName = event.getBannerImage()
                            .replace("http://localhost:8080/uploads/", "");
                    Path filePath = Paths.get("uploads/" + fileName);
                    Files.deleteIfExists(filePath);
                } catch (Exception ignored) {
                    // Non-critical — proceed even if file deletion fails
                }
            }

            eventRepo.deleteById(id);
            return ResponseEntity.ok("Event deleted successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error deleting event");
        }
    }

    // -------------------- UPDATE EVENT --------------------
    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
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

            Event event = eventRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Event not found"));

            // Only creator can update
            if (!event.getCreatedBy().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("You are not authorized to update this event");
            }

            // Update fields
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

            // Handle banner update
            if (bannerImage != null && !bannerImage.isEmpty()) {

                String uploadDir = "uploads/";
                Files.createDirectories(Paths.get(uploadDir));

                String fileName = System.currentTimeMillis() + "_" +
                        bannerImage.getOriginalFilename();

                Path filePath = Paths.get(uploadDir + fileName);
                Files.write(filePath, bannerImage.getBytes());

                event.setBannerImage("http://localhost:8080/uploads/" + fileName);
            }

            eventRepo.save(event);

            return ResponseEntity.ok("Event updated successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating event");
        }
    }
}
