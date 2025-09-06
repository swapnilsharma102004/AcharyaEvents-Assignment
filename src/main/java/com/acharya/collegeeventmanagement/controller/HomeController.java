package com.acharya.collegeeventmanagement.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {
    
    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
            "message", "College Event Management System API",
            "version", "1.0.0",
            "status", "running",
            "endpoints", Map.of(
                "colleges", "/api/colleges",
                "students", "/api/students", 
                "events", "/api/events",
                "registrations", "/api/registrations",
                "attendance", "/api/attendance",
                "feedback", "/api/feedback",
                "reports", "/api/reports",
                "health", "/actuator/health"
            ),
            "documentation", "See README.md for complete API documentation"
        );
    }
}
