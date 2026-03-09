package com.example.springapp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "ngo_profile")
public class NGOProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "organization_name")
    private String organizationName;

    @Column(name = "registration_number", unique = true)
    private String registrationNumber;

    private String category;

    @Column(length = 2000)
    private String description;

    private String address;
    private String city;
    private String state;

    @Column(name = "verification_status")
    private String verificationStatus;

    private String mission;
    private String vision;

    private String phone;
    private String website;

    private String logoUrl;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public NGOProfile() {}
    public void setUserId(User user) {
        this.user = user;
    }

}