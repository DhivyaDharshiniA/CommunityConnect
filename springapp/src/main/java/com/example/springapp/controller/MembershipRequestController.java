package com.example.springapp.controller;

import com.example.springapp.dto.MembershipRequestDTO;
import com.example.springapp.entity.MembershipRequest;
import com.example.springapp.entity.NGOProfile;
import com.example.springapp.entity.User;
import com.example.springapp.repository.NGOProfileRepository;
import com.example.springapp.repository.UserRepository;
import com.example.springapp.service.MembershipRequestService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/membership")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MembershipRequestController {

    private final MembershipRequestService membershipRequestService;
    private final UserRepository userRepository;
    private final NGOProfileRepository ngoProfileRepository;

    // USER SEND REQUEST
    @PostMapping("/request")
    public ResponseEntity<MembershipRequest> requestMembership(
            @RequestBody MembershipRequestDTO dto,
            Authentication authentication) {

        String email = authentication.getName();

        MembershipRequest request = membershipRequestService.sendRequest(
                email,
                dto.getNgoId(),
                dto.getMessage()
        );

        return ResponseEntity.ok(request);
    }

    // NGO VIEW REQUESTS
//    @GetMapping("/my-requests")
//    public ResponseEntity<List<MembershipRequest>> getMyRequests(
//            Authentication authentication) {
//
//        String email = authentication.getName();
//
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        NGOProfile ngo = ngoProfileRepository.findByUser_Id(user.getId())
//                .orElseThrow(() -> new RuntimeException("NGO Profile not found"));
//
//        return ResponseEntity.ok(
//                membershipRequestService.getRequestsForNgo(ngo.getId())
//        );
//    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<MembershipRequest>> getMyRequests(Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        NGOProfile ngo = ngoProfileRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("NGO Profile not found"));

        return ResponseEntity.ok(
                membershipRequestService.getRequestsForNgo(ngo.getId())
        );
    }

    // APPROVE
    @PutMapping("/approve/{id}")
    public ResponseEntity<MembershipRequest> approve(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        NGOProfile ngo = ngoProfileRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("NGO Profile not found"));

        return ResponseEntity.ok(
                membershipRequestService.approveRequest(id, ngo.getId())
        );
    }

    // REJECT
    @PutMapping("/reject/{id}")
    public ResponseEntity<MembershipRequest> reject(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        NGOProfile ngo = ngoProfileRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("NGO Profile not found"));

        return ResponseEntity.ok(
                membershipRequestService.rejectRequest(id, ngo.getId())
        );
    }

    // APPROVED MEMBERS
    @GetMapping("/members")
    public ResponseEntity<List<MembershipRequest>> getMembers(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        NGOProfile ngo = ngoProfileRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new RuntimeException("NGO Profile not found"));

        System.out.println("*******************************");
        System.out.println("user"+user.getId());
        System.out.println("user"+ngo.getId());
        System.out.println("*******************************");

        return ResponseEntity.ok(
                membershipRequestService.getApprovedMembers(ngo.getId())
        );
    }
}