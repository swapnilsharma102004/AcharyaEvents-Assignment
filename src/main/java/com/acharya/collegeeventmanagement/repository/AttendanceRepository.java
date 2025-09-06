package com.acharya.collegeeventmanagement.repository;

import com.acharya.collegeeventmanagement.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    List<Attendance> findByEventId(Long eventId);
    
    List<Attendance> findByStudentId(Long studentId);
    
    Optional<Attendance> findByStudentIdAndEventId(Long studentId, Long eventId);
    
    boolean existsByStudentIdAndEventId(Long studentId, Long eventId);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.event.id = :eventId AND a.isPresent = true")
    Long countPresentAttendancesByEventId(@Param("eventId") Long eventId);
    
    @Query("SELECT a FROM Attendance a WHERE a.event.id = :eventId AND a.isPresent = true")
    List<Attendance> findPresentAttendancesByEventId(@Param("eventId") Long eventId);
    
    @Query("SELECT a FROM Attendance a WHERE a.student.id = :studentId AND a.isPresent = true")
    List<Attendance> findPresentAttendancesByStudentId(@Param("studentId") Long studentId);
}
