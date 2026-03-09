package com.example.springapp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic details
    private String title;

    @Column(length = 2000)
    private String description;

    private String category;

    // Location details
    private String location;
    private String venue;
    private String city;
    private String state;

    // Organizer details
    private String organizerName;
    private String contactEmail;
    private String contactPhone;

    // Event timing
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;

    // Event information
    private String requirements;
    private String benefits;

    private String bannerImage;

    // Event status
    private String status; // UPCOMING / ONGOING / COMPLETED

    // QR code path
    private String qrCodePath;

    // Creator
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
}