package com.acharya.collegeeventmanagement.controller;

import com.acharya.collegeeventmanagement.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {
    
    @Autowired
    private ReportService reportService;
    
    @GetMapping("/event-popularity")
    public ResponseEntity<List<Map<String, Object>>> getEventPopularityReport() {
        List<Map<String, Object>> report = reportService.getEventPopularityReport();
        return ResponseEntity.ok(report);
    }
    
    @GetMapping("/attendance/event/{eventId}")
    public ResponseEntity<Map<String, Object>> getAttendanceReportByEventId(@PathVariable Long eventId) {
        try {
            Map<String, Object> report = reportService.getAttendanceReportByEventId(eventId);
            return ResponseEntity.ok(report);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/attendance/all")
    public ResponseEntity<List<Map<String, Object>>> getAllEventsAttendanceReport() {
        List<Map<String, Object>> report = reportService.getAllEventsAttendanceReport();
        return ResponseEntity.ok(report);
    }
    
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getOverallStatistics() {
        Map<String, Object> stats = reportService.getOverallStatistics();
        return ResponseEntity.ok(stats);
    }
}
