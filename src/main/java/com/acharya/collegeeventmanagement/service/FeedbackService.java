package com.acharya.collegeeventmanagement.service;

import com.acharya.collegeeventmanagement.entity.Event;
import com.acharya.collegeeventmanagement.entity.Feedback;
import com.acharya.collegeeventmanagement.entity.Student;
import com.acharya.collegeeventmanagement.repository.EventRepository;
import com.acharya.collegeeventmanagement.repository.FeedbackRepository;
import com.acharya.collegeeventmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FeedbackService {
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    public Feedback submitFeedback(Long studentId, Long eventId, Integer rating, String comment) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        
        if (!event.getIsActive()) {
            throw new RuntimeException("Event is not active");
        }
        
        // Check if feedback already exists
        if (feedbackRepository.existsByStudentIdAndEventId(studentId, eventId)) {
            throw new RuntimeException("Student has already submitted feedback for this event");
        }
        
        Feedback feedback = new Feedback(student, event, rating, comment);
        return feedbackRepository.save(feedback);
    }
    
    public Feedback updateFeedback(Long studentId, Long eventId, Integer rating, String comment) {
        Feedback feedback = feedbackRepository.findByStudentIdAndEventId(studentId, eventId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
        
        feedback.setRating(rating);
        feedback.setComment(comment);
        feedback.setFeedbackDate(java.time.LocalDateTime.now());
        
        return feedbackRepository.save(feedback);
    }
    
    public List<Feedback> getFeedbacksByEventId(Long eventId) {
        return feedbackRepository.findFeedbacksByEventIdOrderByDateDesc(eventId);
    }
    
    public List<Feedback> getFeedbacksByStudentId(Long studentId) {
        return feedbackRepository.findByStudentId(studentId);
    }
    
    public Optional<Feedback> getFeedbackByStudentAndEvent(Long studentId, Long eventId) {
        return feedbackRepository.findByStudentIdAndEventId(studentId, eventId);
    }
    
    public Double getAverageRatingByEventId(Long eventId) {
        Double averageRating = feedbackRepository.findAverageRatingByEventId(eventId);
        return averageRating != null ? averageRating : 0.0;
    }
    
    public Long getFeedbackCountByEventId(Long eventId) {
        return feedbackRepository.countFeedbacksByEventId(eventId);
    }
    
    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }
    
    public void deleteFeedback(Long feedbackId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found with id: " + feedbackId));
        feedbackRepository.delete(feedback);
    }
}
