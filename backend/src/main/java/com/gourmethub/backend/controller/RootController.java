package com.gourmethub.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Void> root() {
        // Redirect the root to the public items API so the browser sees something useful
        return ResponseEntity.status(302).location(URI.create("/api/items")).build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
}
