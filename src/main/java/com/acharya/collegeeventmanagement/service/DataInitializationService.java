package com.acharya.collegeeventmanagement.service;

import com.acharya.collegeeventmanagement.entity.Role;
import com.acharya.collegeeventmanagement.entity.User;
import com.acharya.collegeeventmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DataInitializationService implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        try {
            // Create default admin user if it doesn't exist
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@college.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setFirstName("Admin");
                admin.setLastName("User");
                admin.setRole(Role.ADMIN);
                admin.setIsActive(true);
                
                userRepository.save(admin);
                System.out.println("Default admin user created: username=admin, password=admin123");
            }
            
            // Create a sample regular user if it doesn't exist
            if (userRepository.findByUsername("user").isEmpty()) {
                User user = new User();
                user.setUsername("user");
                user.setEmail("user@college.com");
                user.setPassword(passwordEncoder.encode("user123"));
                user.setFirstName("Regular");
                user.setLastName("User");
                user.setRole(Role.USER);
                user.setIsActive(true);
                
                userRepository.save(user);
                System.out.println("Sample user created: username=user, password=user123");
            }
        } catch (Exception e) {
            System.err.println("Warning: Could not create default users due to SQLite limitations: " + e.getMessage());
            System.err.println("You can manually create users through the API or frontend.");
        }
    }
}
