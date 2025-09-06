package com.acharya.collegeeventmanagement.controller;

import com.acharya.collegeeventmanagement.entity.Attendance;
import com.acharya.collegeeventmanagement.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {
    
    @Autowired
    private AttendanceService attendanceService;
    
    @PostMapping("/mark")
    public ResponseEntity<?> markAttendance(@RequestParam Long studentId, @RequestParam Long eventId) {
        try {
            Attendance attendance = attendanceService.markAttendance(studentId, eventId);
            return ResponseEntity.status(HttpStatus.CREATED).body(attendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/mark-absent")
    public ResponseEntity<?> markAbsent(@RequestParam Long studentId, @RequestParam Long eventId) {
        try {
            Attendance attendance = attendanceService.markAbsent(studentId, eventId);
            return ResponseEntity.status(HttpStatus.CREATED).body(attendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        List<Attendance> attendances = attendanceService.getAllAttendance();
        return ResponseEntity.ok(attendances);
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Attendance>> getAttendanceByEventId(@PathVariable Long eventId) {
        List<Attendance> attendances = attendanceService.getAttendanceByEventId(eventId);
        return ResponseEntity.ok(attendances);
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getAttendanceByStudentId(@PathVariable Long studentId) {
        List<Attendance> attendances = attendanceService.getAttendanceByStudentId(studentId);
        return ResponseEntity.ok(attendances);
    }
    
    @GetMapping("/event/{eventId}/present")
    public ResponseEntity<List<Attendance>> getPresentAttendanceByEventId(@PathVariable Long eventId) {
        List<Attendance> attendances = attendanceService.getPresentAttendanceByEventId(eventId);
        return ResponseEntity.ok(attendances);
    }
    
    @GetMapping("/student/{studentId}/present")
    public ResponseEntity<List<Attendance>> getPresentAttendanceByStudentId(@PathVariable Long studentId) {
        List<Attendance> attendances = attendanceService.getPresentAttendanceByStudentId(studentId);
        return ResponseEntity.ok(attendances);
    }
    
    @GetMapping("/student/{studentId}/event/{eventId}")
    public ResponseEntity<?> getAttendanceByStudentAndEvent(@PathVariable Long studentId, @PathVariable Long eventId) {
        Optional<Attendance> attendance = attendanceService.getAttendanceByStudentAndEvent(studentId, eventId);
        if (attendance.isPresent()) {
            return ResponseEntity.ok(attendance.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/event/{eventId}/count")
    public ResponseEntity<Map<String, Long>> getAttendanceCountByEventId(@PathVariable Long eventId) {
        Long count = attendanceService.getAttendanceCountByEventId(eventId);
        return ResponseEntity.ok(Map.of("attendanceCount", count));
    }
}
