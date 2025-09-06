package com.acharya.collegeeventmanagement.repository;

import com.acharya.collegeeventmanagement.entity.Registration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    
    List<Registration> findByEventId(Long eventId);
    
    List<Registration> findByStudentId(Long studentId);
    
    Optional<Registration> findByStudentIdAndEventId(Long studentId, Long eventId);
    
    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);
    
    @Query("SELECT COUNT(r) FROM Registration r WHERE r.event.id = :eventId AND r.isConfirmed = true")
    Long countConfirmedRegistrationsByEventId(@Param("eventId") Long eventId);
    
    @Query("SELECT r FROM Registration r WHERE r.event.id = :eventId AND r.isConfirmed = true")
    List<Registration> findConfirmedRegistrationsByEventId(@Param("eventId") Long eventId);
}
