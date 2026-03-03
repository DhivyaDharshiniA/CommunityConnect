package com.example.springapp.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class VolunteerRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String skills;
    private String availability;
    private String message;

    private String status = "PENDING"; // PENDING / APPROVED / REJECTED

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}