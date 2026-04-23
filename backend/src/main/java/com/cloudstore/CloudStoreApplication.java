package com.cloudstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Cloud Store application.
 * @SpringBootApplication enables auto-configuration, component scanning, etc.
 */
@SpringBootApplication
public class CloudStoreApplication {
    public static void main(String[] args) {
        SpringApplication.run(CloudStoreApplication.class, args);
        System.out.println("✅ Cloud Store Backend is running on http://localhost:8080");
    }
}
