package com.acharya.collegeeventmanagement.service;

import com.acharya.collegeeventmanagement.entity.Attendance;
import com.acharya.collegeeventmanagement.entity.Event;
import com.acharya.collegeeventmanagement.entity.Student;
import com.acharya.collegeeventmanagement.repository.AttendanceRepository;
import com.acharya.collegeeventmanagement.repository.EventRepository;
import com.acharya.collegeeventmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AttendanceService {
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    public Attendance markAttendance(Long studentId, Long eventId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        
        if (!event.getIsActive()) {
            throw new RuntimeException("Event is not active");
        }
        
        // Check if attendance already exists
        Optional<Attendance> existingAttendance = attendanceRepository.findByStudentIdAndEventId(studentId, eventId);
        if (existingAttendance.isPresent()) {
            Attendance attendance = existingAttendance.get();
            attendance.setIsPresent(true);
            attendance.setAttendanceTime(java.time.LocalDateTime.now());
            return attendanceRepository.save(attendance);
        }
        
        Attendance attendance = new Attendance(student, event);
        return attendanceRepository.save(attendance);
    }
    
    public Attendance markAbsent(Long studentId, Long eventId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        
        Optional<Attendance> existingAttendance = attendanceRepository.findByStudentIdAndEventId(studentId, eventId);
        if (existingAttendance.isPresent()) {
            Attendance attendance = existingAttendance.get();
            attendance.setIsPresent(false);
            attendance.setAttendanceTime(java.time.LocalDateTime.now());
            return attendanceRepository.save(attendance);
        }
        
        Attendance attendance = new Attendance(student, event);
        attendance.setIsPresent(false);
        return attendanceRepository.save(attendance);
    }
    
    public List<Attendance> getAttendanceByEventId(Long eventId) {
        return attendanceRepository.findByEventId(eventId);
    }
    
    public List<Attendance> getAttendanceByStudentId(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }
    
    public List<Attendance> getPresentAttendanceByEventId(Long eventId) {
        return attendanceRepository.findPresentAttendancesByEventId(eventId);
    }
    
    public List<Attendance> getPresentAttendanceByStudentId(Long studentId) {
        return attendanceRepository.findPresentAttendancesByStudentId(studentId);
    }
    
    public Optional<Attendance> getAttendanceByStudentAndEvent(Long studentId, Long eventId) {
        return attendanceRepository.findByStudentIdAndEventId(studentId, eventId);
    }
    
    public Long getAttendanceCountByEventId(Long eventId) {
        return attendanceRepository.countPresentAttendancesByEventId(eventId);
    }
    
    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }
}
