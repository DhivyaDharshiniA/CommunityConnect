//package com.example.springapp.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.time.LocalDateTime;
//
//import com.example.springapp.entity.Attendance;
//import com.example.springapp.entity.Event;
//import com.example.springapp.entity.User;
//import com.example.springapp.repository.AttendanceRepository;
//import com.example.springapp.repository.EventRepository;
//import com.example.springapp.repository.UserRepository;
//
//@RestController
//@RequestMapping("/api/attendance")
//@CrossOrigin
//public class AttendanceController {
//
//    @Autowired
//    private AttendanceRepository attendanceRepo;
//
//    @Autowired
//    private EventRepository eventRepo;
//
//    @Autowired
//    private UserRepository userRepo;
//
//    @PostMapping("/scan/{eventId}/{userId}")
//    public String markAttendance(@PathVariable Long eventId,
//                                 @PathVariable Long userId) {
//
//        Event event = eventRepo.findById(eventId).orElseThrow();
//        User user = userRepo.findById(userId).orElseThrow();
//
//        Attendance attendance = new Attendance();
//        attendance.setEvent(event);
//        attendance.setUser(user);
//        attendance.setScannedAt(LocalDateTime.now());
//
//        attendanceRepo.save(attendance);
//
//        return "Attendance Marked!";
//    }
//
//
//    @GetMapping("/attend/{eventId}")
//    public ResponseEntity<String> markAttendance(
//            @PathVariable Long eventId,
//            @AuthenticationPrincipal UserDetails userDetails) {
//
//        User user = userRepo.findByEmail(userDetails.getUsername())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        Event event = eventRepo.findById(eventId)
//                .orElseThrow(() -> new RuntimeException("Event not found"));
//
//        // Save attendance (you need attendance table)
//        event.getAttendees().add(user);
//        eventRepo.save(event);
//
//        return ResponseEntity.ok("Attendance marked successfully!");
//    }
//
//    @GetMapping("/count/{eventId}")
//    public long countAttendance(@PathVariable Long eventId) {
//        return attendanceRepo.countByEventId(eventId);
//    }
//}

package com.example.springapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

import com.example.springapp.entity.Attendance;
import com.example.springapp.entity.Event;
import com.example.springapp.entity.User;
import com.example.springapp.repository.AttendanceRepository;
import com.example.springapp.repository.EventRepository;
import com.example.springapp.repository.UserRepository;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

//@RestController
//@RequestMapping("/api/attendance")
//@CrossOrigin
//public class AttendanceController {
//
//    @Autowired
//    private AttendanceRepository attendanceRepo;
//
//    @Autowired
//    private EventRepository eventRepo;
//
//    @Autowired
//    private UserRepository userRepo;
//
//    // QR SCAN ATTENDANCE (User scans QR → attendance marked)
//    @GetMapping("/scan/{eventId}")
//    public ResponseEntity<String> markAttendance(
//            @PathVariable Long eventId,
//            @AuthenticationPrincipal UserDetails userDetails) {
//
//        if (userDetails == null) {
//            return ResponseEntity.status(401)
//                    .body("Please login first to mark attendance.");
//        }
//
//        User user = userRepo.findByEmail(userDetails.getUsername())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        Event event = eventRepo.findById(eventId)
//                .orElseThrow(() -> new RuntimeException("Event not found"));
//
//        boolean alreadyMarked =
//                attendanceRepo.existsByEventIdAndUserId(eventId, user.getId());
//
//        if (alreadyMarked) {
//            return ResponseEntity.ok("Attendance already marked.");
//        }
//
//        Attendance attendance = new Attendance();
//        attendance.setEvent(event);
//        attendance.setUser(user);
//        attendance.setScannedAt(LocalDateTime.now());
//
//        attendanceRepo.save(attendance);
//
//        return ResponseEntity.ok("Attendance marked successfully!");
//    }
//
//    // ADMIN / TEST METHOD (Manual attendance)
//    @PostMapping("/manual/{eventId}/{userId}")
//    public ResponseEntity<String> markManualAttendance(
//            @PathVariable Long eventId,
//            @PathVariable Long userId) {
//
//        Event event = eventRepo.findById(eventId).orElseThrow();
//        User user = userRepo.findById(userId).orElseThrow();
//
//        Attendance attendance = new Attendance();
//        attendance.setEvent(event);
//        attendance.setUser(user);
//        attendance.setScannedAt(LocalDateTime.now());
//
//        attendanceRepo.save(attendance);
//
//        return ResponseEntity.ok("Manual attendance marked!");
//    }
//
//    @PostMapping("/mark/{eventId}")
//    public ResponseEntity<String> markAttendance(
//            @PathVariable Long eventId,
//            @RequestBody Attendance request) {
//
//        Event event = eventRepo.findById(eventId)
//                .orElseThrow(() -> new RuntimeException("Event not found"));
//
//        Attendance attendance = new Attendance();
//        attendance.setEvent(event);
//        attendance.setName(request.getName());
//        attendance.setEmail(request.getEmail());
//        attendance.setScannedAt(LocalDateTime.now());
//
//        attendanceRepo.save(attendance);
//
//        return ResponseEntity.ok("Attendance marked successfully!");
//    }
//
//    // COUNT ATTENDANCE
//    @GetMapping("/count/{eventId}")
//    public long countAttendance(@PathVariable Long eventId) {
//        return attendanceRepo.countByEventId(eventId);
//    }
//}

@RestController
@RequestMapping("/api/attendance")
//@CrossOrigin
@CrossOrigin(origins = { "http://localhost:5173", "http://192.168.56.1:5173" })

public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepo;

    @Autowired
    private EventRepository eventRepo;

    @Autowired
    private UserRepository userRepo;

    // QR SCAN (logged-in users)
    @GetMapping("/scan/{eventId}")
    public ResponseEntity<String> markAttendanceByQR(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(401)
                    .body("Please login first to mark attendance.");
        }

        User user = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        boolean alreadyMarked =
                attendanceRepo.existsByEventIdAndUserId(eventId, user.getId());

        if (alreadyMarked) {
            return ResponseEntity.ok("Attendance already marked.");
        }

        Attendance attendance = new Attendance();
        attendance.setEvent(event);
        attendance.setUser(user);
        attendance.setScannedAt(LocalDateTime.now());

        attendanceRepo.save(attendance);

        return ResponseEntity.ok("Attendance marked successfully!");
    }

    // PUBLIC FORM ATTENDANCE
    @PostMapping("/mark/{eventId}")
    public ResponseEntity<String> markAttendanceFromForm(
            @PathVariable Long eventId,
            @RequestBody Attendance request) {

        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Attendance attendance = new Attendance();
        attendance.setEvent(event);
        attendance.setName(request.getName());
        attendance.setEmail(request.getEmail());
        attendance.setScannedAt(LocalDateTime.now());

        attendanceRepo.save(attendance);

        return ResponseEntity.ok("Attendance submitted successfully!");
    }

    // MANUAL ATTENDANCE (admin)
    @PostMapping("/manual/{eventId}/{userId}")
    public ResponseEntity<String> markManualAttendance(
            @PathVariable Long eventId,
            @PathVariable Long userId) {

        Event event = eventRepo.findById(eventId).orElseThrow();
        User user = userRepo.findById(userId).orElseThrow();

        Attendance attendance = new Attendance();
        attendance.setEvent(event);
        attendance.setUser(user);
        attendance.setScannedAt(LocalDateTime.now());

        attendanceRepo.save(attendance);

        return ResponseEntity.ok("Manual attendance marked!");
    }

    // COUNT
    @GetMapping("/count/{eventId}")
    public long countAttendance(@PathVariable Long eventId) {
        return attendanceRepo.countByEventId(eventId);
    }
}