package com.example.springapp.service;

import com.example.springapp.dto.NGORegisterRequest;
import com.example.springapp.entity.NGOProfile;
import com.example.springapp.entity.User;
import com.example.springapp.repository.NGOProfileRepository;
import com.example.springapp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NGOProfileService {

    private final NGOProfileRepository ngoRepository;
    private final UserRepository userRepository;

    public NGOProfileService(NGOProfileRepository repository, UserRepository userRepository) {
        this.ngoRepository = repository;
        this.userRepository = userRepository;
    }

    // Register NGO
//    public NGOProfile registerNGO(NGORegisterRequest request) {
//
//        if(ngoRepository.existsByRegistrationNumber(request.getRegistrationNumber())){
//            throw new RuntimeException("NGO already registered");
//        }
//
//        User user = userRepository.findById(request.getUserId())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        NGOProfile ngo = new NGOProfile();
//
//        ngo.setUser(user);
//        ngo.setOrganizationName(request.getOrganizationName());
//        ngo.setRegistrationNumber(request.getRegistrationNumber());
//        ngo.setCategory(request.getCategory());
//        ngo.setDescription(request.getDescription());
//        ngo.setAddress(request.getAddress());
//        ngo.setCity(request.getCity());
//        ngo.setState(request.getState());
//
//        ngo.setVerificationStatus("PENDING");
//        ngo.setCreatedAt(LocalDateTime.now());
//
//        return ngoRepository.save(ngo);
//    }
    public void createNGOProfile(User user, NGORegisterRequest request) {

        NGOProfile profile = new NGOProfile();

        profile.setUser(user);
        profile.setOrganizationName(request.getOrganizationName());
        profile.setRegistrationNumber(request.getRegistrationNumber());
        profile.setCategory(request.getCategory());
        profile.setDescription(request.getDescription());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());
        profile.setState(request.getState());
        profile.setPhone(request.getPhone());
        profile.setWebsite(request.getWebsite());
        profile.setVerificationStatus("PENDING");
        profile.setCreatedAt(LocalDateTime.now());

        ngoRepository.save(profile);
    }
    // Admin verify NGO
    public NGOProfile verifyNGO(Long ngoId){

        NGOProfile ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        ngo.setVerificationStatus("VERIFIED");
        ngo.setVerifiedAt(LocalDateTime.now());

        return ngoRepository.save(ngo);
    }

    // Reject NGO
    public NGOProfile rejectNGO(Long ngoId){

        NGOProfile ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        ngo.setVerificationStatus("REJECTED");

        return ngoRepository.save(ngo);
    }

    // List pending NGOs
    public List<NGOProfile> getPendingNGOs(){
        return ngoRepository.findByVerificationStatus("PENDING");
    }

    public NGOProfile getNgoProfile(Long id) {
        return ngoRepository.findById(id).orElseThrow();
    }

    public NGOProfile updateProfile(Long id, NGOProfile updatedNgo) {

        NGOProfile ngo = ngoRepository.findById(id).orElseThrow();

        ngo.setOrganizationName(updatedNgo.getOrganizationName());
        ngo.setDescription(updatedNgo.getDescription());
        ngo.setMission(updatedNgo.getMission());
        ngo.setVision(updatedNgo.getVision());
        ngo.setPhone(updatedNgo.getPhone());
        ngo.setWebsite(updatedNgo.getWebsite());
        ngo.setAddress(updatedNgo.getAddress());
        ngo.setCity(updatedNgo.getCity());
        ngo.setState(updatedNgo.getState());

        return ngoRepository.save(ngo);
    }

}