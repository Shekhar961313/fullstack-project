package com.cloudstore.service;

import com.cloudstore.model.FileMetadata;
import com.cloudstore.repository.FileMetadataRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Service layer for file operations.
 * Handles uploading, deleting, listing files, and generating stats.
 */
@Service
public class FileService {

    // Read the upload directory path from application.properties
    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private FileMetadataRepository fileRepository;

    /**
     * Create the uploads folder when the app starts (if it doesn't exist).
     */
    @PostConstruct
    public void init() {
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    /**
     * Upload a file: save it to disk and store metadata in the database.
     */
    public FileMetadata uploadFile(MultipartFile file, Long userId) throws IOException {
        // Create a unique filename to avoid conflicts
        String storedName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, storedName);

        // Copy the file to our uploads folder
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Save file info to the database
        FileMetadata metadata = new FileMetadata();
        metadata.setFileName(file.getOriginalFilename());
        metadata.setFileSize(file.getSize());
        metadata.setFileType(file.getContentType());
        metadata.setUploadDate(LocalDateTime.now());
        metadata.setUserId(userId);
        metadata.setStoredFileName(storedName);

        return fileRepository.save(metadata);
    }

    /**
     * Get all files for a specific user.
     */
    public List<FileMetadata> getFilesByUserId(Long userId) {
        return fileRepository.findByUserId(userId);
    }

    /**
     * Delete a file from disk and database.
     */
    public void deleteFile(Long fileId, Long userId) throws IOException {
        // Find the file in the database
        FileMetadata file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        // Make sure the file belongs to this user
        if (!file.getUserId().equals(userId)) {
            throw new RuntimeException("You can only delete your own files");
        }

        // Delete the actual file from disk
        Path filePath = Paths.get(uploadDir, file.getStoredFileName());
        Files.deleteIfExists(filePath);

        // Delete the record from database
        fileRepository.delete(file);
    }

    /**
     * Generate statistics about the user's files.
     * Used by the Analytics page.
     */
    public Map<String, Object> getStats(Long userId) {
        List<FileMetadata> files = fileRepository.findByUserId(userId);

        // Count files by type category
        Map<String, Long> filesByType = new HashMap<>();
        // Storage used by type category
        Map<String, Long> storageByType = new HashMap<>();
        // Upload trend: how many files uploaded each day
        Map<String, Long> uploadTrend = new TreeMap<>();

        long totalStorage = 0;

        for (FileMetadata file : files) {
            // Determine the category (Images, PDFs, Documents, Others)
            String category = getFileCategory(file.getFileType());

            // Count files per category
            filesByType.merge(category, 1L, Long::sum);

            // Sum up storage per category
            storageByType.merge(category, file.getFileSize(), Long::sum);

            // Count uploads per date
            String date = file.getUploadDate().toLocalDate().toString();
            uploadTrend.merge(date, 1L, Long::sum);

            totalStorage += file.getFileSize();
        }

        // Build the response
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalFiles", files.size());
        stats.put("totalStorage", totalStorage);
        stats.put("filesByType", filesByType);
        stats.put("storageByType", storageByType);
        stats.put("uploadTrend", uploadTrend);

        return stats;
    }

    /**
     * Helper: determine file category from MIME type.
     */
    private String getFileCategory(String mimeType) {
        if (mimeType == null) return "Others";
        if (mimeType.startsWith("image/")) return "Images";
        if (mimeType.equals("application/pdf")) return "PDFs";
        if (mimeType.contains("document") || mimeType.contains("word")
                || mimeType.contains("text") || mimeType.contains("sheet")) return "Documents";
        return "Others";
    }
}
