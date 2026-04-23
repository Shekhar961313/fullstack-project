package com.cloudstore.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS Configuration - allows the React frontend to call our backend API.
 * Without this, the browser would block requests from localhost:5173 to localhost:8080.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")                    // Apply to all /api/ endpoints
                .allowedOrigins("http://localhost:5173", "https://fullstack-project-drab-one.vercel.app") // Local & Vercel
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);                   // Allow session cookies
    }
}
