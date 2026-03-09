package com.example.springapp.controller;

import com.example.springapp.dto.NGORegisterRequest;
import com.example.springapp.entity.NGOProfile;
import com.example.springapp.service.NGOProfileService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ngos")
public class NGOProfileController {

    private final NGOProfileService service;

    public NGOProfileController(NGOProfileService service) {
        this.service = service;
    }

    // Register NGO
//    @PostMapping("/register")
//    public NGOProfile registerNGO(@RequestBody NGORegisterRequest request){
//        return service.registerNGO(request);
//    }

    // Admin verify NGO
    @PutMapping("/{id}/verify")
    public NGOProfile verifyNGO(@PathVariable Long id){
        return service.verifyNGO(id);
    }

    // Admin reject NGO
    @PutMapping("/{id}/reject")
    public NGOProfile rejectNGO(@PathVariable Long id){
        return service.rejectNGO(id);
    }

    // Get pending NGOs
    @GetMapping("/pending")
    public List<NGOProfile> getPendingNGOs(){
        return service.getPendingNGOs();
    }

    @GetMapping("/{id}")
    public NGOProfile getProfile(@PathVariable Long id) {
        return service.getNgoProfile(id);
    }

    @PutMapping("/{id}")
    public NGOProfile updateProfile(@PathVariable Long id,
                             @RequestBody NGOProfile ngo) {

        return service.updateProfile(id, ngo);
    }
}