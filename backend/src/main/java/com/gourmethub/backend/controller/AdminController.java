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
        System.out.println("AdminController.setAdminRole: id=" + id + ", value=" + value);
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        User u = opt.get();
        // Replace roles entirely: if granting admin => only ROLE_ADMIN, otherwise => only ROLE_USER
        if (value) {
            u.setRoles(new java.util.HashSet<>(java.util.Set.of("ROLE_ADMIN")));
            System.out.println("AdminController.setAdminRole: Setting ROLE_ADMIN for user " + u.getEmail());
        } else {
            u.setRoles(new java.util.HashSet<>(java.util.Set.of("ROLE_USER")));
            System.out.println("AdminController.setAdminRole: Setting ROLE_USER for user " + u.getEmail());
        }
        userRepository.save(u);
        boolean isAdmin = u.getRoles().contains("ROLE_ADMIN");
        System.out.println("AdminController.setAdminRole: After save, isAdmin=" + isAdmin + " for user " + u.getEmail());
        return ResponseEntity.ok(Map.of("updated", true, "id", id, "isAdmin", isAdmin));
    }
}
