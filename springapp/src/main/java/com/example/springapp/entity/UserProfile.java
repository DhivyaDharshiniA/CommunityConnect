package com.example.springapp.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String phone;
    private String location;
    private String bio;
    private String profileImage;

    // 🔗 One-to-One mapping with User

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;
}