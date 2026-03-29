package com.example.springapp.repository;

import com.example.springapp.entity.NGOProfile;
import com.example.springapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NGOProfileRepository extends JpaRepository<NGOProfile, Long> {

    List<NGOProfile> findByVerificationStatus(String status);
    Optional<NGOProfile> findByUser_Id(Long userId);

}