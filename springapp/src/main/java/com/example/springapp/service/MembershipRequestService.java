//////package com.example.springapp.service;
//////
//////import com.example.springapp.entity.MembershipRequest;
//////import com.example.springapp.repository.MembershipRequestRepository;
//////import lombok.RequiredArgsConstructor;
//////import org.springframework.stereotype.Service;
//////
//////import java.util.List;
//////
//////@Service
//////@RequiredArgsConstructor
//////public class MembershipRequestService {
//////
//////    private final MembershipRequestRepository membershipRequestRepository;
//////
//////    public MembershipRequest sendRequest(String userEmail, Long ngoId, String message) {
//////        // Check for duplicate request
//////        membershipRequestRepository.findByUserEmailAndNgoId(userEmail, ngoId)
//////                .ifPresent(r -> { throw new RuntimeException("You have already requested membership for this NGO."); });
//////
//////        MembershipRequest request = MembershipRequest.builder()
//////                .userEmail(userEmail)
//////                .ngoId(ngoId)
//////                .message(message)
//////                .status("Pending")
//////                .build();
//////
//////        return membershipRequestRepository.save(request);
//////    }
//////
//////
//////    public List<MembershipRequest> getRequestsForNgo(Long ngoId) {
//////        return membershipRequestRepository.findByNgoId(ngoId);
//////    }
//////
//////    // 🔹 Approve Request
//////    public MembershipRequest approveRequest(Long id) {
//////        MembershipRequest request = membershipRequestRepository.findById(id)
//////                .orElseThrow(() -> new RuntimeException("Request not found"));
//////
//////        request.setStatus("APPROVED");
//////        return membershipRequestRepository.save(request);
//////    }
//////
//////    // 🔹 Reject Request
//////    public MembershipRequest rejectRequest(Long id) {
//////        MembershipRequest request = membershipRequestRepository.findById(id)
//////                .orElseThrow(() -> new RuntimeException("Request not found"));
//////
//////        request.setStatus("REJECTED");
//////        return membershipRequestRepository.save(request);
//////    }
//////
//////}
////
////package com.example.springapp.service;
////
////import com.example.springapp.entity.MembershipRequest;
////import com.example.springapp.repository.MembershipRequestRepository;
////import lombok.RequiredArgsConstructor;
////import org.springframework.stereotype.Service;
////
////import java.util.List;
////
////@Service
////@RequiredArgsConstructor
////public class MembershipRequestService {
////
////    private final MembershipRequestRepository membershipRequestRepository;
////
////    // 🔹 Send Request
////    public MembershipRequest sendRequest(String userEmail, Long ngoId, String message) {
////
////        membershipRequestRepository
////                .findByUserEmailAndNgoId(userEmail, ngoId)
////                .ifPresent(r -> {
////                    throw new RuntimeException("You already requested this NGO");
////                });
////
////        MembershipRequest request = MembershipRequest.builder()
////                .userEmail(userEmail)
////                .ngoId(ngoId)
////                .message(message)
////                .status("PENDING")
////                .build();
////
////        return membershipRequestRepository.save(request);
////    }
////
////    // 🔹 Get all requests for NGO
////    public List<MembershipRequest> getRequestsForNgo(Long ngoId) {
////        return membershipRequestRepository.findByNgoId(ngoId);
////    }
////
////    // 🔹 Approve (SECURE VERSION)
////    public MembershipRequest approveRequest(Long requestId, Long ngoId) {
////
////        MembershipRequest request = membershipRequestRepository.findById(requestId)
////                .orElseThrow(() -> new RuntimeException("Request not found"));
////
////        if (!request.getNgoId().equals(ngoId)) {
////            throw new RuntimeException("Unauthorized approval attempt");
////        }
////
////        request.setStatus("APPROVED");
////
////        return membershipRequestRepository.save(request);
////    }
////
////    // 🔹 Reject (SECURE VERSION)
////    public MembershipRequest rejectRequest(Long requestId, Long ngoId) {
////
////        MembershipRequest request = membershipRequestRepository.findById(requestId)
////                .orElseThrow(() -> new RuntimeException("Request not found"));
////
////        if (!request.getNgoId().equals(ngoId)) {
////            throw new RuntimeException("Unauthorized reject attempt");
////        }
////
////        request.setStatus("REJECTED");
////
////        return membershipRequestRepository.save(request);
////    }
////
////    // 🔹 Get approved members
////    public List<MembershipRequest> getApprovedMembers(Long ngoId) {
////        return membershipRequestRepository
////                .findByNgoIdAndStatus(ngoId, "APPROVED");
////    }
////}
//
//
//package com.example.springapp.service;
//
//import com.example.springapp.entity.MembershipRequest;
//import com.example.springapp.repository.MembershipRequestRepository;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class MembershipRequestService {
//
//    private final MembershipRequestRepository membershipRequestRepository;
//
//    // Send request
//    public MembershipRequest sendRequest(String userEmail, Long ngoId, String message) {
//
//        membershipRequestRepository
//                .findByUserEmailAndNgoId(userEmail, ngoId)
//                .ifPresent(r -> {
//                    throw new RuntimeException("You already requested this NGO");
//                });
//
//        MembershipRequest request = MembershipRequest.builder()
//                .userEmail(userEmail)
//                .ngoId(ngoId)
//                .message(message)
//                .status("PENDING")
//                .build();
//
//        return membershipRequestRepository.save(request);
//    }
//
//    // Get requests for NGO
//    public List<MembershipRequest> getRequestsForNgo(Long ngoId) {
//        return membershipRequestRepository.findByNgoId(ngoId);
//    }
//
//    // Approve request
//    public MembershipRequest approveRequest(Long requestId, Long ngoId) {
//
//        MembershipRequest request = membershipRequestRepository.findById(requestId)
//                .orElseThrow(() -> new RuntimeException("Request not found"));
//
//        if (!request.getNgoId().equals(ngoId)) {
//            throw new RuntimeException("Unauthorized approval attempt");
//        }
//
//        request.setStatus("APPROVED");
//
//        return membershipRequestRepository.save(request);
//    }
//
//    // Reject request
//    public MembershipRequest rejectRequest(Long requestId, Long ngoId) {
//
//        MembershipRequest request = membershipRequestRepository.findById(requestId)
//                .orElseThrow(() -> new RuntimeException("Request not found"));
//
//        if (!request.getNgoId().equals(ngoId)) {
//            throw new RuntimeException("Unauthorized reject attempt");
//        }
//
//        request.setStatus("REJECTED");
//
//        return membershipRequestRepository.save(request);
//    }
//
//    // Approved members
//    public List<MembershipRequest> getApprovedMembers(Long ngoId) {
//        return membershipRequestRepository
//                .findByNgoIdAndStatus(ngoId, "APPROVED");
//    }
//}
//


package com.example.springapp.service;

import com.example.springapp.entity.MembershipRequest;
import com.example.springapp.entity.NGOProfile;
import com.example.springapp.repository.MembershipRequestRepository;
import com.example.springapp.repository.NGOProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MembershipRequestService {

    private final MembershipRequestRepository membershipRequestRepository;
    private final NGOProfileRepository ngoProfileRepository;

    // 🔹 Send request
    public MembershipRequest sendRequest(String userEmail, Long ngoId, String message) {

        membershipRequestRepository
                .findByUserEmailAndNgo_Id(userEmail, ngoId)
                .ifPresent(r -> {
                    throw new RuntimeException("You already requested this NGO");
                });

        NGOProfile ngo = ngoProfileRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        MembershipRequest request = MembershipRequest.builder()
                .userEmail(userEmail)
                .ngo(ngo)
                .message(message)
                .status("PENDING")
                .build();

        return membershipRequestRepository.save(request);
    }

    // 🔹 Get all requests
    public List<MembershipRequest> getRequestsForNgo(Long ngoId) {
        return membershipRequestRepository.findByNgo_Id(ngoId);
    }

    // 🔹 Approve
    public MembershipRequest approveRequest(Long requestId, Long ngoId) {

        MembershipRequest request = membershipRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getNgo().getId().equals(ngoId)) {
            throw new RuntimeException("Unauthorized approval attempt");
        }

        request.setStatus("APPROVED");

        return membershipRequestRepository.save(request);
    }

    // 🔹 Reject
    public MembershipRequest rejectRequest(Long requestId, Long ngoId) {

        MembershipRequest request = membershipRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getNgo().getId().equals(ngoId)) {
            throw new RuntimeException("Unauthorized reject attempt");
        }

        request.setStatus("REJECTED");

        return membershipRequestRepository.save(request);
    }

    // 🔹 Approved members
    public List<MembershipRequest> getApprovedMembers(Long ngoId) {
        return membershipRequestRepository
                .findByNgo_IdAndStatus(ngoId, "APPROVED");
    }
}