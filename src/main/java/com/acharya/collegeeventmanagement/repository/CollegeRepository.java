package com.acharya.collegeeventmanagement.repository;

import com.acharya.collegeeventmanagement.entity.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CollegeRepository extends JpaRepository<College, Long> {
    
    Optional<College> findByName(String name);
    
    boolean existsByName(String name);
}
