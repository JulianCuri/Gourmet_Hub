package com.gourmethub.backend.controller;

import com.gourmethub.backend.config.JwtUtil;
import com.gourmethub.backend.dto.AuthRequest;
import com.gourmethub.backend.dto.AuthResponse;
import com.gourmethub.backend.model.User;
import com.gourmethub.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest req) {
        if (userService.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email ya registrado");
        }
        User u = new User();
        u.setNombre("");
        u.setApellido("");
        u.setEmail(req.getEmail());
        u.setPassword(req.getPassword());
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");
        u.setRoles(roles);
        User saved = userService.saveUser(u);
        return ResponseEntity.status(201).body(saved.getEmail());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        var opt = userService.findByEmail(req.getEmail());
        if (opt.isEmpty()) return ResponseEntity.status(401).body("Credenciales inválidas");
        var user = opt.get();
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
        String token = jwtUtil.generateToken(user.getEmail(), user.getRoles());
        return ResponseEntity.ok(new AuthResponse(token, user.getEmail()));
    }
}
