package com.example.springapp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.*;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HelpRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String category;

    @Column(length = 2000)
    private String description;

    private Double amountNeeded;

    private Double amountRaised = 0.0;

    private String contactNumber;

    private String location;

    private LocalDate deadline;  // or LocalDateTime

    private String medicalDocumentUrl;

    private String feeReceiptUrl;

    private Integer fraudScore = 0;

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    @OneToMany(mappedBy = "helpRequest", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Donation> donations;

    private String createdBy;

}