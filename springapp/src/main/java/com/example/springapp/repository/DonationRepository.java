package com.example.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.springapp.entity.Donation;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long>{

    List<Donation> findByHelpRequestId(Long helpRequestId);

}