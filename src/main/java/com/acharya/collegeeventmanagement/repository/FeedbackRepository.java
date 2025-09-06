package com.acharya.collegeeventmanagement.repository;

import com.acharya.collegeeventmanagement.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    List<Feedback> findByEventId(Long eventId);
    
    List<Feedback> findByStudentId(Long studentId);
    
    Optional<Feedback> findByStudentIdAndEventId(Long studentId, Long eventId);
    
    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);
    
    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.event.id = :eventId")
    Double findAverageRatingByEventId(@Param("eventId") Long eventId);
    
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.event.id = :eventId")
    Long countFeedbacksByEventId(@Param("eventId") Long eventId);
    
    @Query("SELECT f FROM Feedback f WHERE f.event.id = :eventId ORDER BY f.feedbackDate DESC")
    List<Feedback> findFeedbacksByEventIdOrderByDateDesc(@Param("eventId") Long eventId);
}
