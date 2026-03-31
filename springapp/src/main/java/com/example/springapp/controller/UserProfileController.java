package com.example.springapp.controller;

import com.example.springapp.entity.User;
import com.example.springapp.entity.UserProfile;
import com.example.springapp.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class UserProfileController {

    @Autowired
    private UserProfileService service;

    @GetMapping("/{userId}")
    public Map<String, Object> getProfile(@PathVariable Long userId) {

        UserProfile profile = service.getProfile(userId);
        User user = profile.getUser();

        Map<String, Object> response = new HashMap<>();
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("phone", profile.getPhone());
        response.put("location", profile.getLocation());
        response.put("bio", profile.getBio());

        return response;
    }

    @PutMapping("/{userId}")
    public UserProfile updateProfile(@PathVariable Long userId, @RequestBody UserProfile profile) {
        return service.updateProfile(userId, profile);
    }
}