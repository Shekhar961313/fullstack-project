package com.cloudstore.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * FileMetadata entity - stores info about each uploaded file.
 * JPA will create a "files" table from this class.
 */
@Entity
@Table(name = "files")
public class FileMetadata {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;        // Original file name (e.g., "photo.png")
    private Long fileSize;          // File size in bytes
    private String fileType;        // MIME type (e.g., "image/png")
    private LocalDateTime uploadDate; // When the file was uploaded
    private Long userId;            // Which user uploaded this file
    private String storedFileName;  // Name used to store file on disk

    // Default constructor (required by JPA)
    public FileMetadata() {}

    // --- Getters and Setters ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public LocalDateTime getUploadDate() { return uploadDate; }
    public void setUploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getStoredFileName() { return storedFileName; }
    public void setStoredFileName(String storedFileName) { this.storedFileName = storedFileName; }
}
