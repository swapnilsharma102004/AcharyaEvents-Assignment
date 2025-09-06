package com.acharya.collegeeventmanagement.service;

import com.acharya.collegeeventmanagement.entity.Event;
import com.acharya.collegeeventmanagement.repository.AttendanceRepository;
import com.acharya.collegeeventmanagement.repository.EventRepository;
import com.acharya.collegeeventmanagement.repository.FeedbackRepository;
import com.acharya.collegeeventmanagement.repository.RegistrationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private RegistrationRepository registrationRepository;
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private FeedbackRepository feedbackRepository;
    
    public List<Map<String, Object>> getEventPopularityReport() {
        List<Event> events = eventRepository.findAll();
        List<Map<String, Object>> report = new ArrayList<>();
        
        for (Event event : events) {
            Map<String, Object> eventData = new HashMap<>();
            eventData.put("eventId", event.getId());
            eventData.put("eventName", event.getName());
            eventData.put("eventDate", event.getEventDate());
            eventData.put("maxCapacity", event.getMaxCapacity());
            eventData.put("currentRegistrations", event.getCurrentRegistrations());
            eventData.put("registrationCount", registrationRepository.countConfirmedRegistrationsByEventId(event.getId()));
            eventData.put("attendanceCount", attendanceRepository.countPresentAttendancesByEventId(event.getId()));
            eventData.put("averageRating", feedbackRepository.findAverageRatingByEventId(event.getId()));
            eventData.put("feedbackCount", feedbackRepository.countFeedbacksByEventId(event.getId()));
            
            // Calculate popularity score (registrations + attendance + average rating)
            Long registrationCount = registrationRepository.countConfirmedRegistrationsByEventId(event.getId());
            Long attendanceCount = attendanceRepository.countPresentAttendancesByEventId(event.getId());
            Double averageRating = feedbackRepository.findAverageRatingByEventId(event.getId());
            if (averageRating == null) averageRating = 0.0;
            
            double popularityScore = registrationCount + attendanceCount + averageRating;
            eventData.put("popularityScore", popularityScore);
            
            report.add(eventData);
        }
        
        // Sort by popularity score (descending)
        report.sort((a, b) -> Double.compare((Double) b.get("popularityScore"), (Double) a.get("popularityScore")));
        
        return report;
    }
    
    public Map<String, Object> getAttendanceReportByEventId(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        
        Long totalRegistrations = registrationRepository.countConfirmedRegistrationsByEventId(eventId);
        Long presentAttendances = attendanceRepository.countPresentAttendancesByEventId(eventId);
        Long absentCount = totalRegistrations - presentAttendances;
        
        double attendancePercentage = totalRegistrations > 0 ? 
            (double) presentAttendances / totalRegistrations * 100 : 0.0;
        
        Map<String, Object> report = new HashMap<>();
        report.put("eventId", event.getId());
        report.put("eventName", event.getName());
        report.put("eventDate", event.getEventDate());
        report.put("totalRegistrations", totalRegistrations);
        report.put("presentAttendances", presentAttendances);
        report.put("absentCount", absentCount);
        report.put("attendancePercentage", Math.round(attendancePercentage * 100.0) / 100.0);
        
        return report;
    }
    
    public List<Map<String, Object>> getAllEventsAttendanceReport() {
        List<Event> events = eventRepository.findAll();
        List<Map<String, Object>> report = new ArrayList<>();
        
        for (Event event : events) {
            Map<String, Object> eventReport = getAttendanceReportByEventId(event.getId());
            report.add(eventReport);
        }
        
        // Sort by attendance percentage (descending)
        report.sort((a, b) -> Double.compare((Double) b.get("attendancePercentage"), (Double) a.get("attendancePercentage")));
        
        return report;
    }
    
    public Map<String, Object> getOverallStatistics() {
        long totalEvents = eventRepository.count();
        long totalRegistrations = registrationRepository.count();
        long totalAttendances = attendanceRepository.count();
        long totalFeedbacks = feedbackRepository.count();
        
        double averageAttendanceRate = totalRegistrations > 0 ? 
            (double) totalAttendances / totalRegistrations * 100 : 0.0;
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalEvents", totalEvents);
        stats.put("totalRegistrations", totalRegistrations);
        stats.put("totalAttendances", totalAttendances);
        stats.put("totalFeedbacks", totalFeedbacks);
        stats.put("averageAttendanceRate", Math.round(averageAttendanceRate * 100.0) / 100.0);
        
        return stats;
    }
}
