package com.example.springapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.springapp.entity.HelpRequest;
import com.example.springapp.entity.RequestStatus;
import com.example.springapp.repository.HelpRequestRepository;

@Service
public class HelpRequestService {

    @Autowired
    private HelpRequestRepository helpRequestRepository;

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        mailSender.send(message);
    }
    /**
     * Get all help requests.
     */
    public List<HelpRequest> getAllRequests() {
        return helpRequestRepository.findAll();
    }

    /**
     * Get a single help request by ID.
     */
    public HelpRequest getRequestById(Long id) {
        return helpRequestRepository.findById(id).orElse(null);
    }

    /**
     * Get all open requests (pending or flagged).
     */
    public List<HelpRequest> getOpenRequests() {
        return helpRequestRepository.findByStatus(RequestStatus.PENDING);
    }

    /**
     * Update an existing help request.
     */
    public HelpRequest updateRequest(Long id, HelpRequest updatedRequest) {
        Optional<HelpRequest> optionalRequest = helpRequestRepository.findById(id);
        if (!optionalRequest.isPresent()) {
            return null;
        }

        HelpRequest request = optionalRequest.get();
        request.setTitle(updatedRequest.getTitle());
        request.setCategory(updatedRequest.getCategory());
        request.setDescription(updatedRequest.getDescription());
        request.setAmountNeeded(updatedRequest.getAmountNeeded());
        request.setContactNumber(updatedRequest.getContactNumber());
        request.setLocation(updatedRequest.getLocation());
        request.setMedicalDocumentUrl(updatedRequest.getMedicalDocumentUrl());
        request.setFeeReceiptUrl(updatedRequest.getFeeReceiptUrl());
        request.setStatus(updatedRequest.getStatus());

        return helpRequestRepository.save(request);
    }

    /**
     * Delete a help request by ID.
     */
    public void deleteRequest(Long id) {
        helpRequestRepository.deleteById(id);
    }

    /**
     * Mark a request as flagged.
     */
    public HelpRequest flagRequest(HelpRequest request) {
        request.setStatus(RequestStatus.FLAGGED);
        return helpRequestRepository.save(request);
    }

}