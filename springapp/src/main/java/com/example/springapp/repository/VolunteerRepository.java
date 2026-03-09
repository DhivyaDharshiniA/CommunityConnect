package com.example.springapp.repository;

import com.example.springapp.entity.VolunteerRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VolunteerRepository extends JpaRepository<VolunteerRegistration, Long> {

    List<VolunteerRegistration> findByEventId(Long eventId);

    Optional<VolunteerRegistration> findByEventIdAndUserId(Long eventId, Long userId);
    List<VolunteerRegistration> findByUserId(Long userId);

}