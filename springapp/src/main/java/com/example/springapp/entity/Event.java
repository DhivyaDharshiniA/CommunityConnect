//package com.example.springapp.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
//import java.time.LocalDateTime;
//
//@Entity
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class Event {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String title;
//    private String description;
//    private String location;
//    private LocalDateTime dateTime;
//
////    @ManyToOne
////    @JoinColumn(name = "created_by")
////    private User createdBy;
//
//    @ManyToOne
//    @JoinColumn(name = "created_by")
//    @JsonIgnoreProperties({"events"})
//    private User createdBy;
//
//    private String qrCodePath;
//
//    // getters and setters
//}

package com.example.springapp.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String location;
    private LocalDateTime dateTime;

    @ManyToOne
    @JoinColumn(name = "created_by")
    @JsonIgnoreProperties({"events"})
    private User createdBy;

    private String qrCodePath;
}