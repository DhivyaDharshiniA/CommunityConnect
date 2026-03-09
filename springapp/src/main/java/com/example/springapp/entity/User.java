package com.example.springapp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private String role;

    // NGO-specific fields
    private String proofFilePath;

    private boolean verified = false;

    private String extractedOrganizationName;

    private String extractedRegistrationNumber;
}
