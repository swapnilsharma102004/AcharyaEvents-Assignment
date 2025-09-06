package com.acharya.collegeeventmanagement.service;

import com.acharya.collegeeventmanagement.entity.College;
import com.acharya.collegeeventmanagement.repository.CollegeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CollegeService {
    
    @Autowired
    private CollegeRepository collegeRepository;
    
    public College addCollege(College college) {
        if (collegeRepository.existsByName(college.getName())) {
            throw new RuntimeException("College with name '" + college.getName() + "' already exists");
        }
        return collegeRepository.save(college);
    }
    
    public List<College> getAllColleges() {
        return collegeRepository.findAll();
    }
    
    public Optional<College> getCollegeById(Long id) {
        return collegeRepository.findById(id);
    }
    
    public Optional<College> getCollegeByName(String name) {
        return collegeRepository.findByName(name);
    }
    
    public College updateCollege(Long id, College collegeDetails) {
        College college = collegeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("College not found with id: " + id));
        
        if (!college.getName().equals(collegeDetails.getName()) && 
            collegeRepository.existsByName(collegeDetails.getName())) {
            throw new RuntimeException("College with name '" + collegeDetails.getName() + "' already exists");
        }
        
        college.setName(collegeDetails.getName());
        college.setAddress(collegeDetails.getAddress());
        college.setCity(collegeDetails.getCity());
        college.setState(collegeDetails.getState());
        college.setCountry(collegeDetails.getCountry());
        
        return collegeRepository.save(college);
    }
    
    public void deleteCollege(Long id) {
        College college = collegeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("College not found with id: " + id));
        collegeRepository.delete(college);
    }
}
