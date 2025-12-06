package com.gourmethub.backend.controller;

import com.gourmethub.backend.service.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    private final ItemService itemService;

    public DebugController(ItemService itemService) {
        this.itemService = itemService;
    }

    // Development-only helper: delete an item by id without auth checks (secured via SecurityConfig permit)
    @PostMapping("/delete-item/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
