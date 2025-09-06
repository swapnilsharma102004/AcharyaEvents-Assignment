package com.acharya.collegeeventmanagement.service;

import com.acharya.collegeeventmanagement.entity.Event;
import com.acharya.collegeeventmanagement.entity.Registration;
import com.acharya.collegeeventmanagement.entity.Student;
import com.acharya.collegeeventmanagement.repository.EventRepository;
import com.acharya.collegeeventmanagement.repository.RegistrationRepository;
import com.acharya.collegeeventmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class RegistrationService {
    
    @Autowired
    private RegistrationRepository registrationRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    public Registration registerStudentToEvent(Long studentId, Long eventId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        
        if (!event.getIsActive()) {
            throw new RuntimeException("Event is not active");
        }
        
        if (registrationRepository.existsByStudentIdAndEventId(studentId, eventId)) {
            throw new RuntimeException("Student is already registered for this event");
        }
        
        if (event.getCurrentRegistrations() >= event.getMaxCapacity()) {
            throw new RuntimeException("Event is at full capacity");
        }
        
        Registration registration = new Registration(student, event);
        Registration savedRegistration = registrationRepository.save(registration);
        
        // Update event registration count
        event.setCurrentRegistrations(event.getCurrentRegistrations() + 1);
        eventRepository.save(event);
        
        return savedRegistration;
    }
    
    public List<Registration> getRegistrationsByEventId(Long eventId) {
        return registrationRepository.findConfirmedRegistrationsByEventId(eventId);
    }
    
    public List<Registration> getRegistrationsByStudentId(Long studentId) {
        return registrationRepository.findByStudentId(studentId);
    }
    
    public Optional<Registration> getRegistrationByStudentAndEvent(Long studentId, Long eventId) {
        return registrationRepository.findByStudentIdAndEventId(studentId, eventId);
    }
    
    public void cancelRegistration(Long studentId, Long eventId) {
        Registration registration = registrationRepository.findByStudentIdAndEventId(studentId, eventId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));
        
        registrationRepository.delete(registration);
        
        // Update event registration count
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
        event.setCurrentRegistrations(Math.max(0, event.getCurrentRegistrations() - 1));
        eventRepository.save(event);
    }
    
    public Long getRegistrationCountByEventId(Long eventId) {
        return registrationRepository.countConfirmedRegistrationsByEventId(eventId);
    }
    
    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }
}
