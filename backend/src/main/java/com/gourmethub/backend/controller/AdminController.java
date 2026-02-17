package com.gourmethub.backend.controller;

import com.gourmethub.backend.model.User;
import com.gourmethub.backend.service.UserService;
import com.gourmethub.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final UserRepository userRepository;
    private final UserService userService;

    public AdminController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<User>> searchByEmail(@RequestParam(value = "email", required = false) String email) {
        List<User> users = (email == null || email.isBlank()) ? userRepository.findAll() : userRepository.findByEmailContainingIgnoreCase(email);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/list-admins")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<User>> listAdmins() {
        List<User> admins = userRepository.findByRolesContaining("ROLE_ADMIN");
        return ResponseEntity.ok(admins);
    }

    @PostMapping("/{id}/set-admin")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> setAdminRole(@PathVariable Long id, @RequestParam("value") boolean value) {
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        User u = opt.get();
        // Replace roles entirely: if granting admin => only ROLE_ADMIN, otherwise => only ROLE_USER
        if (value) {
            u.setRoles(java.util.Set.of("ROLE_ADMIN"));
        } else {
            u.setRoles(java.util.Set.of("ROLE_USER"));
        }
        userRepository.save(u);
        return ResponseEntity.ok(Map.of("updated", true, "id", id, "isAdmin", roles.contains("ROLE_ADMIN")));
    }
}
