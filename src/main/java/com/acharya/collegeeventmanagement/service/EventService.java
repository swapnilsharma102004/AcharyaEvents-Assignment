package com.acharya.collegeeventmanagement.service;

import com.acharya.collegeeventmanagement.entity.College;
import com.acharya.collegeeventmanagement.entity.Event;
import com.acharya.collegeeventmanagement.repository.CollegeRepository;
import com.acharya.collegeeventmanagement.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private CollegeRepository collegeRepository;
    
    public Event createEvent(Event event) {
        // Verify college exists
        College college = collegeRepository.findById(event.getCollege().getId())
                .orElseThrow(() -> new RuntimeException("College not found with id: " + event.getCollege().getId()));
        
        event.setCollege(college);
        event.setCurrentRegistrations(0);
        event.setIsActive(true);
        
        return eventRepository.save(event);
    }
    
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
    
    public List<Event> getActiveEvents() {
        return eventRepository.findByIsActiveTrue();
    }
    
    public List<Event> getEventsByCollegeId(Long collegeId) {
        return eventRepository.findByCollegeId(collegeId);
    }
    
    public List<Event> getEventsByType(String eventType) {
        return eventRepository.findByEventType(eventType);
    }
    
    public List<Event> getAvailableEvents() {
        return eventRepository.findAvailableEvents();
    }
    
    public List<Event> searchEvents(String searchTerm) {
        return eventRepository.findByNameOrDescriptionContaining(searchTerm, searchTerm);
    }
    
    public List<Event> getEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return eventRepository.findEventsByDateRange(startDate, endDate);
    }
    
    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }
    
    public Event updateEvent(Long id, Event eventDetails) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        
        // Verify college exists
        College college = collegeRepository.findById(eventDetails.getCollege().getId())
                .orElseThrow(() -> new RuntimeException("College not found with id: " + eventDetails.getCollege().getId()));
        
        event.setName(eventDetails.getName());
        event.setDescription(eventDetails.getDescription());
        event.setEventDate(eventDetails.getEventDate());
        event.setLocation(eventDetails.getLocation());
        event.setMaxCapacity(eventDetails.getMaxCapacity());
        event.setEventType(eventDetails.getEventType());
        event.setIsActive(eventDetails.getIsActive());
        event.setCollege(college);
        
        return eventRepository.save(event);
    }
    
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        eventRepository.delete(event);
    }
    
    public void updateEventRegistrationCount(Long eventId) {
        // This will be called by RegistrationService when registrations are added/removed
        // The actual count will be calculated from RegistrationRepository
        eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));
    }
}
