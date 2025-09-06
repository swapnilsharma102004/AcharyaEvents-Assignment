package com.acharya.collegeeventmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "attendances")
public class Attendance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Student is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @NotNull(message = "Event is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @Column(nullable = false)
    private LocalDateTime attendanceTime;
    
    @Column(nullable = false)
    private Boolean isPresent = true;
    
    // Constructors
    public Attendance() {}
    
    public Attendance(Student student, Event event) {
        this.student = student;
        this.event = event;
        this.attendanceTime = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Student getStudent() {
        return student;
    }
    
    public void setStudent(Student student) {
        this.student = student;
    }
    
    public Event getEvent() {
        return event;
    }
    
    public void setEvent(Event event) {
        this.event = event;
    }
    
    public LocalDateTime getAttendanceTime() {
        return attendanceTime;
    }
    
    public void setAttendanceTime(LocalDateTime attendanceTime) {
        this.attendanceTime = attendanceTime;
    }
    
    public Boolean getIsPresent() {
        return isPresent;
    }
    
    public void setIsPresent(Boolean isPresent) {
        this.isPresent = isPresent;
    }
    
    @Override
    public String toString() {
        return "Attendance{" +
                "id=" + id +
                ", student=" + (student != null ? student.getStudentId() : "null") +
                ", event=" + (event != null ? event.getName() : "null") +
                ", attendanceTime=" + attendanceTime +
                ", isPresent=" + isPresent +
                '}';
    }
}
