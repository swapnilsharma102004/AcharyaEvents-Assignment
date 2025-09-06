package com.acharya.collegeeventmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "registrations")
public class Registration {
    
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
    private LocalDateTime registrationDate;
    
    @Column(nullable = false)
    private Boolean isConfirmed = true;
    
    // Constructors
    public Registration() {}
    
    public Registration(Student student, Event event) {
        this.student = student;
        this.event = event;
        this.registrationDate = LocalDateTime.now();
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
    
    public LocalDateTime getRegistrationDate() {
        return registrationDate;
    }
    
    public void setRegistrationDate(LocalDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }
    
    public Boolean getIsConfirmed() {
        return isConfirmed;
    }
    
    public void setIsConfirmed(Boolean isConfirmed) {
        this.isConfirmed = isConfirmed;
    }
    
    @Override
    public String toString() {
        return "Registration{" +
                "id=" + id +
                ", student=" + (student != null ? student.getStudentId() : "null") +
                ", event=" + (event != null ? event.getName() : "null") +
                ", registrationDate=" + registrationDate +
                ", isConfirmed=" + isConfirmed +
                '}';
    }
}
