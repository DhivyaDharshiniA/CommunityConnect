package com.example.springapp.service;

import com.example.springapp.entity.User;
import com.example.springapp.entity.UserProfile;
import com.example.springapp.repository.UserProfileRepository;
import com.example.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository profileRepo;

    @Autowired
    private UserRepository userRepo;

    public UserProfile getProfile(Long userId) {
        return profileRepo.findByUserId(userId)
                .orElseGet(() -> createEmptyProfile(userId));
    }

    private UserProfile createEmptyProfile(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();

        UserProfile profile = new UserProfile();
        profile.setUser(user);

        return profileRepo.save(profile);
    }

    public UserProfile updateProfile(Long userId, UserProfile updated) {
        UserProfile profile = getProfile(userId);

        profile.setPhone(updated.getPhone());
        profile.setLocation(updated.getLocation());
        profile.setBio(updated.getBio());
        profile.setProfileImage(updated.getProfileImage());

        return profileRepo.save(profile);
    }
}