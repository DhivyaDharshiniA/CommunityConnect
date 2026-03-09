package com.example.springapp.service;

import com.example.springapp.entity.Event;
import com.example.springapp.entity.User;
import com.example.springapp.repository.EventRepository;
import com.example.springapp.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private QRCodeService qrService;

    // ---------------- CREATE EVENT ----------------
//    public String createEvent(
//            String userEmail,
//            String title,
//            String description,
//            String category,
//            String venue,
//            String city,
//            String state,
//            String organizerName,
//            String contactEmail,
//            String contactPhone,
//            String startDateTime,
//            String endDateTime,
//            String requirements,
//            String benefits,
//            MultipartFile bannerImage
//    ) throws Exception {
//
//        User user = userRepo.findByEmail(userEmail)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        String fileName = null;
//
//        if (bannerImage != null && !bannerImage.isEmpty()) {
//
//            String uploadDir = "uploads/";
//            Files.createDirectories(Paths.get(uploadDir));
//
//            fileName = System.currentTimeMillis() + "_"
//                    + bannerImage.getOriginalFilename();
//
//            Path filePath = Paths.get(uploadDir + fileName);
//            Files.write(filePath, bannerImage.getBytes());
//        }
//
//        Event event = new Event();
//
//        event.setTitle(title);
//        event.setDescription(description);
//        event.setCategory(category);
//        event.setVenue(venue);
//        event.setCity(city);
//        event.setState(state);
//        event.setOrganizerName(organizerName);
//        event.setContactEmail(contactEmail);
//        event.setContactPhone(contactPhone);
//        event.setStartDateTime(LocalDateTime.parse(startDateTime));
//        event.setEndDateTime(LocalDateTime.parse(endDateTime));
//        event.setRequirements(requirements);
//        event.setBenefits(benefits);
//        event.setStatus("UPCOMING");
//
//        if (fileName != null) {
//            event.setBannerImage("http://localhost:8080/uploads/" + fileName);
//        }
//
//        event.setCreatedBy(user);
//
//        eventRepo.save(event);
//
//        return "Event created successfully";
//    }
    public String createEvent(
            String userEmail,
            String title,
            String description,
            String category,
            String venue,
            String city,
            String state,
            String contactPhone,
            String startDateTime,
            String endDateTime,
            String requirements,
            String benefits,
            MultipartFile bannerImage
    ) throws Exception {

        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String fileName = null;
        if (bannerImage != null && !bannerImage.isEmpty()) {
            String uploadDir = "uploads/";
            Files.createDirectories(Paths.get(uploadDir));
            fileName = System.currentTimeMillis() + "_" + bannerImage.getOriginalFilename();
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

        // Organizer info from logged-in user
        event.setOrganizerName(user.getName());
        event.setContactEmail(user.getEmail());
        event.setContactPhone(contactPhone); // from frontend

        event.setStartDateTime(LocalDateTime.parse(startDateTime));
        event.setEndDateTime(LocalDateTime.parse(endDateTime));
        event.setRequirements(requirements);
        event.setBenefits(benefits);
        event.setStatus("UPCOMING");

        if (fileName != null) {
            event.setBannerImage("http://localhost:8080/uploads/" + fileName);
        }

        event.setCreatedBy(user);
        eventRepo.save(event);

        return "Event created successfully";
    }

    // ---------------- GET ALL EVENTS ----------------
    public List<Event> getAllEvents() {
        return eventRepo.findAll();
    }

    // ---------------- GET MY EVENTS ----------------
    public List<Event> getMyEvents(String userEmail) {

        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return eventRepo.findByCreatedBy(user);
    }

    // ---------------- GET OTHER EVENTS ----------------
    public List<Event> getOtherEvents(String userEmail) {

        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return eventRepo.findByCreatedByIdNot(user.getId());
    }

    // ---------------- GET EVENT BY ID ----------------
    public Event getEventById(Long id) {

        return eventRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    // ---------------- UPDATE EVENT ----------------
    public String updateEvent(Long id, String userEmail, Event updatedEvent) {

        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getCreatedBy().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }

        event.setTitle(updatedEvent.getTitle());
        event.setDescription(updatedEvent.getDescription());
        event.setCategory(updatedEvent.getCategory());
        event.setVenue(updatedEvent.getVenue());
        event.setCity(updatedEvent.getCity());
        event.setState(updatedEvent.getState());
        event.setRequirements(updatedEvent.getRequirements());
        event.setBenefits(updatedEvent.getBenefits());

        eventRepo.save(event);

        return "Event updated successfully";
    }

    // ---------------- DELETE EVENT ----------------
    public String deleteEvent(Long id, String userEmail) {

        User user = userRepo.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getCreatedBy().getId().equals(user.getId())) {
            throw new RuntimeException("Not allowed");
        }

        eventRepo.delete(event);

        return "Event deleted successfully";
    }

    // ---------------- GENERATE QR ----------------
    public String generateQR(Long eventId) throws Exception {

        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        String qrPath = qrService.generateQRCode(Long.valueOf("EVENT_" + event.getId()));

        event.setQrCodePath(qrPath);

        eventRepo.save(event);

        return "QR generated successfully";
    }
}