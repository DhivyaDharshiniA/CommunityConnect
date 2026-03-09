package com.example.springapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.springapp.entity.Donation;
import com.example.springapp.entity.HelpRequest;
import com.example.springapp.repository.DonationRepository;
import com.example.springapp.repository.HelpRequestRepository;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private HelpRequestRepository helpRequestRepository;

    public Donation donate(Long helpRequestId, Donation donation){

        HelpRequest helpRequest = helpRequestRepository
                .findById(helpRequestId)
                .orElseThrow(() -> new RuntimeException("Help request not found"));

        donation.setHelpRequest(helpRequest);

        Donation savedDonation = donationRepository.save(donation);

        helpRequest.setAmountRaised(
                helpRequest.getAmountRaised() + donation.getAmount()
        );

        helpRequestRepository.save(helpRequest);

        return savedDonation;
    }
}