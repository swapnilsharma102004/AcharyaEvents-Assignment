package com.acharya.collegeeventmanagement.controller;

import com.acharya.collegeeventmanagement.entity.Feedback;
import com.acharya.collegeeventmanagement.service.FeedbackService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {
    
    @Autowired
    private FeedbackService feedbackService;
    
    @PostMapping("/submit")
    public ResponseEntity<?> submitFeedback(
            @RequestParam Long studentId,
            @RequestParam Long eventId,
            @RequestParam @Min(1) @Max(5) Integer rating,
            @RequestParam String comment) {
        try {
            Feedback feedback = feedbackService.submitFeedback(studentId, eventId, rating, comment);
            return ResponseEntity.status(HttpStatus.CREATED).body(feedback);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/update")
    public ResponseEntity<?> updateFeedback(
            @RequestParam Long studentId,
            @RequestParam Long eventId,
            @RequestParam @Min(1) @Max(5) Integer rating,
            @RequestParam String comment) {
        try {
            Feedback feedback = feedbackService.updateFeedback(studentId, eventId, rating, comment);
            return ResponseEntity.ok(feedback);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Feedback>> getAllFeedbacks() {
        List<Feedback> feedbacks = feedbackService.getAllFeedbacks();
        return ResponseEntity.ok(feedbacks);
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Feedback>> getFeedbacksByEventId(@PathVariable Long eventId) {
        List<Feedback> feedbacks = feedbackService.getFeedbacksByEventId(eventId);
        return ResponseEntity.ok(feedbacks);
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Feedback>> getFeedbacksByStudentId(@PathVariable Long studentId) {
        List<Feedback> feedbacks = feedbackService.getFeedbacksByStudentId(studentId);
        return ResponseEntity.ok(feedbacks);
    }
    
    @GetMapping("/student/{studentId}/event/{eventId}")
    public ResponseEntity<?> getFeedbackByStudentAndEvent(@PathVariable Long studentId, @PathVariable Long eventId) {
        Optional<Feedback> feedback = feedbackService.getFeedbackByStudentAndEvent(studentId, eventId);
        if (feedback.isPresent()) {
            return ResponseEntity.ok(feedback.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/event/{eventId}/average-rating")
    public ResponseEntity<Map<String, Double>> getAverageRatingByEventId(@PathVariable Long eventId) {
        Double averageRating = feedbackService.getAverageRatingByEventId(eventId);
        return ResponseEntity.ok(Map.of("averageRating", averageRating));
    }
    
    @GetMapping("/event/{eventId}/count")
    public ResponseEntity<Map<String, Long>> getFeedbackCountByEventId(@PathVariable Long eventId) {
        Long count = feedbackService.getFeedbackCountByEventId(eventId);
        return ResponseEntity.ok(Map.of("feedbackCount", count));
    }
    
    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<?> deleteFeedback(@PathVariable Long feedbackId) {
        try {
            feedbackService.deleteFeedback(feedbackId);
            return ResponseEntity.ok(Map.of("message", "Feedback deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
