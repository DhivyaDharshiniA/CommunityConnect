package com.example.springapp.service;

import com.example.springapp.entity.Donation;
import com.example.springapp.entity.HelpRequest;
import com.example.springapp.repository.DonationRepository;
import com.example.springapp.repository.HelpRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private HelpRequestRepository helpRequestRepository;

    public Donation donate(Long helpRequestId, Donation donation) {
        HelpRequest request = helpRequestRepository.findById(helpRequestId)
                .orElseThrow(() -> new RuntimeException("Help Request not found"));

        donation.setHelpRequest(request);
        return donationRepository.save(donation);
    }

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    public List<Donation> getDonationsByRequest(Long helpRequestId) {
        HelpRequest request = helpRequestRepository.findById(helpRequestId)
                .orElseThrow(() -> new RuntimeException("Help Request not found"));
        return donationRepository.findByHelpRequest(request);
    }
}