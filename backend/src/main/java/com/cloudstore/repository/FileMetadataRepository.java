package com.cloudstore.repository;

import com.cloudstore.model.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Repository for FileMetadata entity.
 * Provides database operations for file records.
 */
public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {

    // Get all files uploaded by a specific user
    // SELECT * FROM files WHERE user_id = ?
    List<FileMetadata> findByUserId(Long userId);
}
