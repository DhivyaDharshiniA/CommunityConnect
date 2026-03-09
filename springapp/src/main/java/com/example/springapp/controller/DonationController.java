package com.example.springapp.controller;

import com.example.springapp.entity.Donation;
import com.example.springapp.service.DonationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/donations")   // plural and consistent with REST
@CrossOrigin(origins = "*")
public class DonationController {

    @Autowired
    private DonationService donationService;

    @PostMapping("/{helpRequestId}")
    public ResponseEntity<?> donate(
            @PathVariable Long helpRequestId,
            @RequestBody Donation donation) {

        try {
            Donation savedDonation = donationService.donate(helpRequestId, donation);
            return ResponseEntity.ok(savedDonation);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}