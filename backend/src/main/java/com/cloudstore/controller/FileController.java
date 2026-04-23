package com.cloudstore.controller;

import com.cloudstore.model.FileMetadata;
import com.cloudstore.service.FileService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for file operations (upload, list, delete, stats).
 * All endpoints start with /api/files/
 */
@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileService fileService;

    /**
     * Helper: get user ID from session, or return null if not logged in.
     */
    private Long getUserId(HttpSession session) {
        return (Long) session.getAttribute("userId");
    }

    /**
     * GET /api/files
     * Get all files for the logged-in user.
     */
    @GetMapping
    public ResponseEntity<?> getAllFiles(HttpSession session) {
        Long userId = getUserId(session);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not logged in"));
        }
        List<FileMetadata> files = fileService.getFilesByUserId(userId);
        return ResponseEntity.ok(files);
    }

    /**
     * POST /api/files/upload
     * Upload a new file. The file is sent as multipart form data.
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            HttpSession session) {
        Long userId = getUserId(session);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not logged in"));
        }
        try {
            FileMetadata saved = fileService.uploadFile(file, userId);
            return ResponseEntity.ok(saved);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to upload file"));
        }
    }

    /**
     * DELETE /api/files/{id}
     * Delete a file by its ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFile(@PathVariable Long id, HttpSession session) {
        Long userId = getUserId(session);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not logged in"));
        }
        try {
            fileService.deleteFile(id, userId);
            return ResponseEntity.ok(Map.of("message", "File deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/files/stats
     * Get file statistics (used by the Analytics page).
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getStats(HttpSession session) {
        Long userId = getUserId(session);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not logged in"));
        }
        Map<String, Object> stats = fileService.getStats(userId);
        return ResponseEntity.ok(stats);
    }
}
