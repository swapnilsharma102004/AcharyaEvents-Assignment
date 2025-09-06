package com.acharya.collegeeventmanagement.controller;

import com.acharya.collegeeventmanagement.entity.Registration;
import com.acharya.collegeeventmanagement.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "*")
public class RegistrationController {
    
    @Autowired
    private RegistrationService registrationService;
    
    @PostMapping("/register")
    public ResponseEntity<?> registerStudentToEvent(@RequestParam Long studentId, @RequestParam Long eventId) {
        try {
            Registration registration = registrationService.registerStudentToEvent(studentId, eventId);
            return ResponseEntity.status(HttpStatus.CREATED).body(registration);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Registration>> getAllRegistrations() {
        List<Registration> registrations = registrationService.getAllRegistrations();
        return ResponseEntity.ok(registrations);
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Registration>> getRegistrationsByEventId(@PathVariable Long eventId) {
        List<Registration> registrations = registrationService.getRegistrationsByEventId(eventId);
        return ResponseEntity.ok(registrations);
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Registration>> getRegistrationsByStudentId(@PathVariable Long studentId) {
        List<Registration> registrations = registrationService.getRegistrationsByStudentId(studentId);
        return ResponseEntity.ok(registrations);
    }
    
    @GetMapping("/student/{studentId}/event/{eventId}")
    public ResponseEntity<?> getRegistrationByStudentAndEvent(@PathVariable Long studentId, @PathVariable Long eventId) {
        Optional<Registration> registration = registrationService.getRegistrationByStudentAndEvent(studentId, eventId);
        if (registration.isPresent()) {
            return ResponseEntity.ok(registration.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/event/{eventId}/count")
    public ResponseEntity<Map<String, Long>> getRegistrationCountByEventId(@PathVariable Long eventId) {
        Long count = registrationService.getRegistrationCountByEventId(eventId);
        return ResponseEntity.ok(Map.of("registrationCount", count));
    }
    
    @DeleteMapping("/cancel")
    public ResponseEntity<?> cancelRegistration(@RequestParam Long studentId, @RequestParam Long eventId) {
        try {
            registrationService.cancelRegistration(studentId, eventId);
            return ResponseEntity.ok(Map.of("message", "Registration cancelled successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
