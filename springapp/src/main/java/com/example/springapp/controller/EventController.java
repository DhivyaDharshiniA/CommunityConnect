////package com.example.springapp.controller;
////
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.web.bind.annotation.*;
////
////import java.util.List;
////
////import com.example.springapp.entity.Event;
////import com.example.springapp.entity.User;
////import com.example.springapp.repository.EventRepository;
////import com.example.springapp.repository.UserRepository;
////import com.example.springapp.service.QRCodeService;
////
////@RestController
////@RequestMapping("/api/events")
////@CrossOrigin
////public class EventController {
////
////    @Autowired
////    private EventRepository eventRepo;
////
////    @Autowired
////    private UserRepository userRepo;
////
////    @Autowired
////    private QRCodeService qrService;
////
////    @PostMapping("/create/{userId}")
////    public Event createEvent(@RequestBody Event event,
////                             @PathVariable Long userId) throws Exception {
////
////        User user = userRepo.findById(userId).orElseThrow();
////
////        event.setCreatedBy(user);
////        Event savedEvent = eventRepo.save(event);
////
////        String qrText = "EVENT_ID:" + savedEvent.getId();
////        String qrPath = qrService.generateQRCode(qrText, savedEvent.getId());
////
////        savedEvent.setQrCodePath(qrPath);
////        return eventRepo.save(savedEvent);
////    }
////
////    @GetMapping("/all")
////    public List<Event> getAllEvents() {
////        return eventRepo.findAll();
////    }
////}
////
////package com.example.springapp.controller;
////
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.http.HttpStatus;
////import org.springframework.http.ResponseEntity;
////import org.springframework.web.bind.annotation.*;
////
////import java.util.List;
////
////import com.example.springapp.entity.Event;
////import com.example.springapp.entity.User;
////import com.example.springapp.repository.EventRepository;
////import com.example.springapp.repository.UserRepository;
////import com.example.springapp.service.QRCodeService;
////
////import org.springframework.security.core.annotation.AuthenticationPrincipal;
////
////import org.springframework.security.core.userdetails.UserDetails;
////
////@RestController
////@RequestMapping("/api/events")
////@CrossOrigin
////public class EventController {
////
////    @Autowired
////    private EventRepository eventRepo;
////
////    @Autowired
////    private UserRepository userRepo;
////
////    @Autowired
////    private QRCodeService qrService;
////
////    // -------------------- CREATE EVENT --------------------
////    @PostMapping("/create/{userId}")
////    public ResponseEntity<Event> createEvent(@RequestBody Event event,
////                                             @PathVariable Long userId) {
////        try {
////            User user = userRepo.findById(userId)
////                    .orElseThrow(() -> new RuntimeException("User not found"));
////
////            event.setCreatedBy(user);
////
////            // save event first to get ID
////            Event savedEvent = eventRepo.save(event);
////
////            // generate QR code
////            String qrText = "EVENT_ID:" + savedEvent.getId();
////            String qrPath = qrService.generateQRCode(qrText, savedEvent.getId());
////
////            savedEvent.setQrCodePath(qrPath);
////            savedEvent = eventRepo.save(savedEvent); // save QR path
////
////            return ResponseEntity.ok(savedEvent);
////        } catch (Exception e) {
////            e.printStackTrace();
////            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
////        }
////    }
////
////
////    @PostMapping("/create")
////    public ResponseEntity<Event> createEvent(@RequestBody Event event, @AuthenticationPrincipal UserDetails userDetails) {
////        try {
////            User user = userRepo.findByEmail(userDetails.getUsername())
////                    .orElseThrow(() -> new RuntimeException("User not found"));
////
////            event.setCreatedBy(user);
////            Event savedEvent = eventRepo.save(event);
////
////            String qrText = "EVENT_ID:" + savedEvent.getId();
////            String qrPath = qrService.generateQRCode(qrText, savedEvent.getId());
////            savedEvent.setQrCodePath(qrPath);
////            savedEvent = eventRepo.save(savedEvent);
////
////            return ResponseEntity.ok(savedEvent);
////        } catch (Exception e) {
////            e.printStackTrace();
////            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
////        }
////    }
////
////    // -------------------- GET ALL EVENTS --------------------
////    @GetMapping("/all")
////    public ResponseEntity<List<Event>> getAllEvents() {
////        try {
////            List<Event> events = eventRepo.findAll();
////            return ResponseEntity.ok(events);
////        } catch (Exception e) {
////            e.printStackTrace();
////            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
////        }
////    }
////
////    // -------------------- GET EVENTS CREATED BY USER --------------------
////    @GetMapping("/my/{userId}")
////    public ResponseEntity<List<Event>> getMyEvents(@PathVariable Long userId) {
////        try {
////            User user = userRepo.findById(userId)
////                    .orElseThrow(() -> new RuntimeException("User not found"));
////            List<Event> myEvents = eventRepo.findByCreatedBy(user);
////            return ResponseEntity.ok(myEvents);
////        } catch (Exception e) {
////            e.printStackTrace();
////            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
////        }
////    }
////
////    // -------------------- GET EVENTS REGISTERED BY USER --------------------
//////    @GetMapping("/registered/{userId}")
//////    public ResponseEntity<List<Event>> getRegisteredEvents(@PathVariable Long userId) {
//////        try {
//////            User user = userRepo.findById(userId)
//////                    .orElseThrow(() -> new RuntimeException("User not found"));
//////            List<Event> registeredEvents = eventRepo.findByRegisteredUsersContains(user);
//////            return ResponseEntity.ok(registeredEvents);
//////        } catch (Exception e) {
//////            e.printStackTrace();
//////            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//////        }
//////    }
////}
//
//
//package com.example.springapp.controller;
//
//import com.example.springapp.entity.Event;
//import com.example.springapp.entity.User;
//import com.example.springapp.repository.EventRepository;
//import com.example.springapp.repository.UserRepository;
//import com.example.springapp.service.QRCodeService;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.core.userdetails.UserDetails;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/events")
//@CrossOrigin(origins = "*")
//public class EventController {
//
//    @Autowired
//    private EventRepository eventRepo;
//
//    @Autowired
//    private UserRepository userRepo;
//
//    @Autowired
//    private QRCodeService qrService;
//
//    // -------------------- CREATE EVENT --------------------
//    @PostMapping("/create")
//    public ResponseEntity<?> createEvent(
//            @RequestBody Event event,
//            @AuthenticationPrincipal UserDetails userDetails) {
//
//        try {
//            // Get logged-in user
//            User user = userRepo.findByEmail(userDetails.getUsername())
//                    .orElseThrow(() -> new RuntimeException("User not found"));
//
//            // Assign creator
//            event.setCreatedBy(user);
//
//            // Save event first
//            Event savedEvent = eventRepo.save(event);
//
//            // Generate QR code
////            String qrText = "EVENT_ID:" + savedEvent.getId();
////            String qrPath = qrService.generateQRCode(qrText, savedEvent.getId());
//            String qrPath = qrService.generateQRCode(savedEvent.getId());
//            savedEvent.setQrCodePath(qrPath);
//
//            // Save again with QR path
//            savedEvent = eventRepo.save(savedEvent);
//
//            return ResponseEntity.ok(savedEvent);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Error creating event");
//        }
//    }
//
//    // -------------------- GET ALL EVENTS --------------------
//    @GetMapping("/all")
//    public ResponseEntity<?> getAllEvents() {
//        try {
//            List<Event> events = eventRepo.findAll();
//            return ResponseEntity.ok(events);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Error fetching events");
//        }
//    }
//
//    // -------------------- GET MY EVENTS --------------------
//    @GetMapping("/my")
//    public ResponseEntity<?> getMyEvents(
//            @AuthenticationPrincipal UserDetails userDetails) {
//
//        try {
//            User user = userRepo.findByEmail(userDetails.getUsername())
//                    .orElseThrow(() -> new RuntimeException("User not found"));
//
//            List<Event> myEvents = eventRepo.findByCreatedBy(user);
//            return ResponseEntity.ok(myEvents);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Error fetching your events");
//        }
//    }
//
//    // -------------------- DELETE EVENT --------------------
//    @DeleteMapping("/delete/{eventId}")
//    public ResponseEntity<?> deleteEvent(@PathVariable Long eventId) {
//        try {
//            Event event = eventRepo.findById(eventId)
//                    .orElseThrow(() -> new RuntimeException("Event not found"));
//
//            eventRepo.delete(event);
//
//            return ResponseEntity.ok("Event deleted successfully");
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Error deleting event");
//        }
//    }
//
//    // -------------------- UPDATE EVENT --------------------
//    @PutMapping("/update/{eventId}")
//    public ResponseEntity<?> updateEvent(
//            @PathVariable Long eventId,
//            @RequestBody Event updatedEvent) {
//
//        try {
//            Event event = eventRepo.findById(eventId)
//                    .orElseThrow(() -> new RuntimeException("Event not found"));
//
//            event.setTitle(updatedEvent.getTitle());
//            event.setDescription(updatedEvent.getDescription());
//            event.setLocation(updatedEvent.getLocation());
//            event.setDateTime(updatedEvent.getDateTime());
//
//            Event savedEvent = eventRepo.save(event);
//
//            return ResponseEntity.ok(savedEvent);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Error updating event");
//        }
//    }
//}


package com.example.springapp.controller;

import com.example.springapp.entity.Event;
import com.example.springapp.entity.User;
import com.example.springapp.repository.EventRepository;
import com.example.springapp.repository.UserRepository;
import com.example.springapp.service.QRCodeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

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
    @PostMapping("/create")
    public ResponseEntity<?> createEvent(@RequestBody Event event,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userRepo.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            event.setCreatedBy(user);

            Event savedEvent = eventRepo.save(event);

            String qrFileName = qrService.generateQRCode(savedEvent.getId());
            savedEvent.setQrCodePath(qrFileName);

            savedEvent = eventRepo.save(savedEvent);

            return ResponseEntity.ok(savedEvent);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating event");
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
}