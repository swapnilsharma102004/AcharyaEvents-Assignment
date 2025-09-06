package com.acharya.collegeeventmanagement.service;

import com.acharya.collegeeventmanagement.entity.College;
import com.acharya.collegeeventmanagement.entity.Student;
import com.acharya.collegeeventmanagement.repository.CollegeRepository;
import com.acharya.collegeeventmanagement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private CollegeRepository collegeRepository;
    
    public Student addStudent(Student student) {
        if (studentRepository.existsByStudentId(student.getStudentId())) {
            throw new RuntimeException("Student with ID '" + student.getStudentId() + "' already exists");
        }
        
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Student with email '" + student.getEmail() + "' already exists");
        }
        
        // Verify college exists
        College college = collegeRepository.findById(student.getCollege().getId())
                .orElseThrow(() -> new RuntimeException("College not found with id: " + student.getCollege().getId()));
        
        student.setCollege(college);
        return studentRepository.save(student);
    }
    
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }
    
    public Optional<Student> getStudentByStudentId(String studentId) {
        return studentRepository.findByStudentId(studentId);
    }
    
    public List<Student> getStudentsByCollegeId(Long collegeId) {
        return studentRepository.findByCollegeId(collegeId);
    }
    
    public List<Student> searchStudents(String searchTerm) {
        return studentRepository.findByStudentIdOrNameContaining(searchTerm, searchTerm);
    }
    
    public Student updateStudent(Long id, Student studentDetails) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        
        if (!student.getStudentId().equals(studentDetails.getStudentId()) && 
            studentRepository.existsByStudentId(studentDetails.getStudentId())) {
            throw new RuntimeException("Student with ID '" + studentDetails.getStudentId() + "' already exists");
        }
        
        if (!student.getEmail().equals(studentDetails.getEmail()) && 
            studentRepository.existsByEmail(studentDetails.getEmail())) {
            throw new RuntimeException("Student with email '" + studentDetails.getEmail() + "' already exists");
        }
        
        // Verify college exists
        College college = collegeRepository.findById(studentDetails.getCollege().getId())
                .orElseThrow(() -> new RuntimeException("College not found with id: " + studentDetails.getCollege().getId()));
        
        student.setStudentId(studentDetails.getStudentId());
        student.setFirstName(studentDetails.getFirstName());
        student.setLastName(studentDetails.getLastName());
        student.setEmail(studentDetails.getEmail());
        student.setPhoneNumber(studentDetails.getPhoneNumber());
        student.setDepartment(studentDetails.getDepartment());
        student.setYearOfStudy(studentDetails.getYearOfStudy());
        student.setCollege(college);
        
        return studentRepository.save(student);
    }
    
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        studentRepository.delete(student);
    }
}
