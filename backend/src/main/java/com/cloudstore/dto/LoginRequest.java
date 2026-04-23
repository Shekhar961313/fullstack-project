package com.cloudstore.dto;

/**
 * DTO (Data Transfer Object) for login requests.
 * This is a simple class to hold the username and password from the login form.
 */
public class LoginRequest {
    private String username;
    private String password;

    // --- Getters and Setters ---

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
