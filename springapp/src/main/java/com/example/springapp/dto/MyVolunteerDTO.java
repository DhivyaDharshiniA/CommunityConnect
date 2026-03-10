package com.example.springapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MyVolunteerDTO {

    private String volunteerName;
    private String email;

    private List<String> appliedEvents;
    private List<String> skills;

    private Long totalEventsRegistered;
}