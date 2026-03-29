//package com.example.springapp.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//@Entity
//@Table(name = "membership_requests")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Builder
//public class MembershipRequest {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String userEmail;
//
//    private Long ngoId;
//
//    @Column(length = 1000)
//    private String message;
//
//    private String status; // Pending, Approved, Rejected
//}

package com.example.springapp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "membership_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    @ManyToOne
    @JoinColumn(name = "ngo_id", nullable = false)
    private NGOProfile ngo;

    @Column(length = 1000)
    private String message;

    private String status; // PENDING, APPROVED, REJECTED
}