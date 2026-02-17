package com.gourmethub.backend.repository;

import com.gourmethub.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    java.util.List<User> findByEmailContainingIgnoreCase(String email);
    java.util.List<User> findByRolesContaining(String role);
}
