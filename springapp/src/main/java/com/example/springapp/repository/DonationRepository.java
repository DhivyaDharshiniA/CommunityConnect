package com.example.springapp.repository;

import com.example.springapp.entity.Donation;
import com.example.springapp.entity.HelpRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByHelpRequest(HelpRequest helpRequest);
}