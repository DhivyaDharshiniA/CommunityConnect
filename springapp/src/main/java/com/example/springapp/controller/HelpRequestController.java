package com.example.springapp.controller;

import com.example.springapp.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

import com.example.springapp.service.HelpRequestService;
import com.example.springapp.service.FileStorageService;
import com.example.springapp.service.FraudDetectionService;
import com.example.springapp.entity.HelpRequest;
import com.example.springapp.entity.RequestStatus;
import com.example.springapp.repository.HelpRequestRepository;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/help")
@CrossOrigin(origins = "*")
public class HelpRequestController {

    @Autowired
    private HelpRequestService service;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private FraudDetectionService fraudService;

    @Autowired
    private HelpRequestRepository helpRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    public HelpRequest createRequest(
            @RequestParam String title,
            @RequestParam String category,
            @RequestParam String description,
            @RequestParam Double amountNeeded,
            @RequestParam String contactNumber,
            @RequestParam String location,
            @RequestParam String createdBy,
            @RequestParam(required = false) MultipartFile medicalDoc,
            @RequestParam(required = false) MultipartFile feeReceipt
    ) throws Exception {

        HelpRequest request = new HelpRequest();

        request.setTitle(title);
        request.setCategory(category);
        request.setDescription(description);
        request.setAmountNeeded(amountNeeded);
        request.setContactNumber(contactNumber);
        request.setLocation(location);
        request.setCreatedBy(createdBy);

        if (medicalDoc != null) {
            String medicalFile = fileStorageService.saveFile(medicalDoc);
            request.setMedicalDocumentUrl(medicalFile);
        }

        if (feeReceipt != null) {
            String feeFile = fileStorageService.saveFile(feeReceipt);
            request.setFeeReceiptUrl(feeFile);
        }

        int fraudScore = fraudService.calculateFraudScore(request);
        request.setFraudScore(fraudScore);

        if (fraudScore >= 50) {
            request.setStatus(RequestStatus.FLAGGED);
        } else {
            request.setStatus(RequestStatus.PENDING);
        }

//        return helpRequestRepository.save(request);
        HelpRequest savedRequest = helpRequestRepository.save(request);

        userRepository.findAll().forEach(user -> {

            String subject = "🚨 New Help Request Posted";

            String message =
                    "Title: " + savedRequest.getTitle() + "\n" +
                            "Category: " + savedRequest.getCategory() + "\n" +
                            "Location: " + savedRequest.getLocation() + "\n" +
                            "Amount Needed: ₹" + savedRequest.getAmountNeeded();

            service.sendEmail(user.getEmail(), subject, message);
        });

        return savedRequest;
    }

    @GetMapping("/all")
    public List<HelpRequest> getAll() {
        return service.getAllRequests();
    }

    @GetMapping("/{id}")
    public HelpRequest getById(@PathVariable Long id) {
        return service.getRequestById(id);
    }

    @GetMapping("/open")
    public List<HelpRequest> getOpenRequests() {
        return service.getOpenRequests();
    }

    @PutMapping("/update/{id}")
    public HelpRequest update(@PathVariable Long id, @RequestBody HelpRequest request) {
        return service.updateRequest(id, request);
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        service.deleteRequest(id);
        return "Request Deleted";
    }

    @GetMapping("/my/{email}")
    public List<HelpRequest> getMyRequests(@PathVariable String email) {
        return helpRequestRepository.findByCreatedBy(email);
    }

    @GetMapping("/pending")
    public List<HelpRequest> getPendingRequests() {
        return helpRequestRepository.findByStatus(RequestStatus.PENDING);
    }
}