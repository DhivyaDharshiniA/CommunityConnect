package com.example.springapp.repository;

import com.example.springapp.entity.NGOProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NGOProfileRepository extends JpaRepository<NGOProfile, Long> {

    List<NGOProfile> findByVerificationStatus(String status);

    boolean existsByRegistrationNumber(String registrationNumber);
}