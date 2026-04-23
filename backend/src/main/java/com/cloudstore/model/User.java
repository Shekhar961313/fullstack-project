package com.cloudstore.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

/**
 * User entity - represents a registered user.
 * JPA will create a "users" table in the database from this class.
 */
@Entity
@Table(name = "users")
public class User {

    // Auto-generated ID
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Username must be unique
    @Column(unique = true, nullable = false)
    private String username;

    // Email must be unique
    @Column(unique = true, nullable = false)
    private String email;

    // WRITE_ONLY = accept password in requests, but NEVER send it back in responses
    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    // Default constructor (required by JPA)
    public User() {}

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
