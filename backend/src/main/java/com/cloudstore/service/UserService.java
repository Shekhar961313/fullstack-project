package com.cloudstore.service;

import com.cloudstore.model.User;
import com.cloudstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Service layer for user-related operations.
 * Contains the business logic for registration and login.
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Register a new user.
     * Checks if username/email already exist before saving.
     */
    public User register(User user) {
        // Check if username is taken
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        // Check if email is taken
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        // Save and return the new user
        return userRepository.save(user);
    }

    /**
     * Login - verify username and password.
     * Returns the user if credentials are correct.
     */
    public User login(String username, String password) {
        // Find user by username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check password (simple comparison - no hashing for beginner simplicity)
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }
        return user;
    }

    /**
     * Get a user by their ID.
     */
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
