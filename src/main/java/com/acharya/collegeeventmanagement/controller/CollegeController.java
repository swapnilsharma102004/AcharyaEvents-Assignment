package com.acharya.collegeeventmanagement.controller;

import com.acharya.collegeeventmanagement.entity.College;
import com.acharya.collegeeventmanagement.service.CollegeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/colleges")
@CrossOrigin(origins = "*")
public class CollegeController {
    
    @Autowired
    private CollegeService collegeService;
    
    @PostMapping
    public ResponseEntity<?> addCollege(@Valid @RequestBody College college) {
        try {
            College savedCollege = collegeService.addCollege(college);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCollege);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<College>> getAllColleges() {
        List<College> colleges = collegeService.getAllColleges();
        return ResponseEntity.ok(colleges);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getCollegeById(@PathVariable Long id) {
        Optional<College> college = collegeService.getCollegeById(id);
        if (college.isPresent()) {
            return ResponseEntity.ok(college.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/name/{name}")
    public ResponseEntity<?> getCollegeByName(@PathVariable String name) {
        Optional<College> college = collegeService.getCollegeByName(name);
        if (college.isPresent()) {
            return ResponseEntity.ok(college.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCollege(@PathVariable Long id, @Valid @RequestBody College collegeDetails) {
        try {
            College updatedCollege = collegeService.updateCollege(id, collegeDetails);
            return ResponseEntity.ok(updatedCollege);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCollege(@PathVariable Long id) {
        try {
            collegeService.deleteCollege(id);
            return ResponseEntity.ok(Map.of("message", "College deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
