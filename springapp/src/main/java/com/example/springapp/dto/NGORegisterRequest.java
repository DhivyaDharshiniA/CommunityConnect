package com.example.springapp.dto;

import lombok.Data;

@Data
public class NGORegisterRequest {

    private String organizationName;
    private String registrationNumber;
    private String category;
    private String description;
    private String address;
    private String city;
    private String state;
    private String mission;
    private String vision;
    private String phone;
    private String website;

}