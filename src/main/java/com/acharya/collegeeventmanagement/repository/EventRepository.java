package com.acharya.collegeeventmanagement.repository;

import com.acharya.collegeeventmanagement.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    List<Event> findByCollegeId(Long collegeId);
    
    List<Event> findByIsActiveTrue();
    
    List<Event> findByEventType(String eventType);
    
    @Query("SELECT e FROM Event e WHERE e.eventDate >= :startDate AND e.eventDate <= :endDate")
    List<Event> findEventsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT e FROM Event e WHERE e.name LIKE %:name% OR e.description LIKE %:description%")
    List<Event> findByNameOrDescriptionContaining(@Param("name") String name, @Param("description") String description);
    
    @Query("SELECT e FROM Event e WHERE e.currentRegistrations < e.maxCapacity AND e.isActive = true")
    List<Event> findAvailableEvents();
}
