package com.cloudstore.repository;

import com.cloudstore.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repository for User entity.
 * Spring Data JPA automatically creates the database queries for us!
 * We just define the method name and Spring figures out the SQL.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    // SELECT * FROM users WHERE username = ?
    Optional<User> findByUsername(String username);

    // SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);
}
