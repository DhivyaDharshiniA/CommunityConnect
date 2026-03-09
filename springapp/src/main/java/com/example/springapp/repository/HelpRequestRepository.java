package com.example.springapp.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.springapp.entity.HelpRequest;
import com.example.springapp.entity.RequestStatus;

@Repository
public interface HelpRequestRepository extends JpaRepository<HelpRequest, Long> {

    List<HelpRequest> findByStatus(RequestStatus status);

    List<HelpRequest> findByContactNumber(String contactNumber);

}