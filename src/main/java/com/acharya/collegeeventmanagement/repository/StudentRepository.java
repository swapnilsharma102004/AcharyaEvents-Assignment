package com.acharya.collegeeventmanagement.repository;

import com.acharya.collegeeventmanagement.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    
    Optional<Student> findByStudentId(String studentId);
    
    Optional<Student> findByEmail(String email);
    
    boolean existsByStudentId(String studentId);
    
    boolean existsByEmail(String email);
    
    List<Student> findByCollegeId(Long collegeId);
    
    @Query("SELECT s FROM Student s WHERE s.studentId LIKE %:studentId% OR s.firstName LIKE %:name% OR s.lastName LIKE %:name%")
    List<Student> findByStudentIdOrNameContaining(@Param("studentId") String studentId, @Param("name") String name);
}
