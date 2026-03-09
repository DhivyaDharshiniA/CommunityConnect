package com.example.springapp.service;

import com.example.springapp.entity.HelpRequest;
import org.springframework.stereotype.Service;

@Service
public class FraudDetectionService {

    public int calculateFraudScore(HelpRequest request) {
        if (request == null || request.getDescription() == null) return 0;

        String desc = request.getDescription().toLowerCase();
        int score = 0;

        if (desc.contains("urgent")) score += 10;
        if (desc.contains("immediately")) score += 10;
        if (desc.contains("money")) score += 5;

        return Math.min(score, 100);
    }
}