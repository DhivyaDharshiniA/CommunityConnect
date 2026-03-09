package com.example.springapp.controller;

import com.example.springapp.entity.Event;
import com.example.springapp.service.EventService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {

    @Autowired
    private EventService eventService;

    // ---------------- CREATE EVENT ----------------
//    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<?> createEvent(
//
//            @AuthenticationPrincipal UserDetails userDetails,
//
//            @RequestParam String title,
//            @RequestParam String description,
//            @RequestParam String category,
//            @RequestParam String venue,
//            @RequestParam String city,
//            @RequestParam String state,
//            @RequestParam String organizerName,
//            @RequestParam String contactEmail,
//            @RequestParam String contactPhone,
//            @RequestParam String startDateTime,
//            @RequestParam String endDateTime,
//            @RequestParam String requirements,
//            @RequestParam String benefits,
//            @RequestParam(required = false) MultipartFile bannerImage
//    ) {
//
//        try {
//
//            String result = eventService.createEvent(
//                    userDetails.getUsername(),
//                    title,
//                    description,
//                    category,
//                    venue,
//                    city,
//                    state,
//                    organizerName,
//                    contactEmail,
//                    contactPhone,
//                    startDateTime,
//                    endDateTime,
//                    requirements,
//                    benefits,
//                    bannerImage
//            );
//
//            return ResponseEntity.ok(result);
//
//        } catch (Exception e) {
//
//            e.printStackTrace();
//            return ResponseEntity.badRequest().body("Error creating event");
//        }
//    }

    @PostMapping(value = "/create", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> createEvent(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestPart("event") EventCreateRequest request,
            @RequestPart(value = "bannerImage", required = false) MultipartFile bannerImage
    ) {
        try {
            String result = eventService.createEvent(
                    userDetails.getUsername(),
                    request.getTitle(),
                    request.getDescription(),
                    request.getCategory(),
                    request.getVenue(),
                    request.getCity(),
                    request.getState(),
                    request.getContactPhone(),  // <-- from frontend
                    request.getStartDateTime(),
                    request.getEndDateTime(),
                    request.getRequirements(),
                    request.getBenefits(),
                    bannerImage
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating event");
        }
    }

    // ---------------- GET ALL EVENTS ----------------
    @GetMapping("/all")
    public ResponseEntity<List<Event>> getAllEvents() {

        return ResponseEntity.ok(eventService.getAllEvents());
    }

    // ---------------- GET MY EVENTS ----------------
    @GetMapping("/my")
    public ResponseEntity<?> getMyEvents(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                eventService.getMyEvents(userDetails.getUsername())
        );
    }

    // ---------------- GET OTHER EVENTS ----------------
    @GetMapping("/others")
    public ResponseEntity<?> getOtherEvents(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(
                eventService.getOtherEvents(userDetails.getUsername())
        );
    }

    // ---------------- GET EVENT BY ID ----------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {

        return ResponseEntity.ok(eventService.getEventById(id));
    }

    // ---------------- UPDATE EVENT ----------------
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Event event
    ) {

        return ResponseEntity.ok(
                eventService.updateEvent(id, userDetails.getUsername(), event)
        );
    }

    // ---------------- DELETE EVENT ----------------
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {

        return ResponseEntity.ok(
                eventService.deleteEvent(id, userDetails.getUsername())
        );
    }

    // ---------------- GENERATE QR ----------------
    @PostMapping("/{id}/generate-qr")
    public ResponseEntity<?> generateQR(@PathVariable Long id) {

        try {

            return ResponseEntity.ok(eventService.generateQR(id));

        } catch (Exception e) {

            e.printStackTrace();
            return ResponseEntity.badRequest().body("QR generation failed");
        }
    }
}