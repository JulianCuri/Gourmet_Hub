package com.gourmethub.backend.controller;

import com.gourmethub.backend.dto.MenuDTO;
import com.gourmethub.backend.model.Menu;
import com.gourmethub.backend.model.Item;
import com.gourmethub.backend.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.context.SecurityContextHolder;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/menus")
public class MenuController {

    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    private MenuDTO toDto(Menu m) {
        MenuDTO d = new MenuDTO();
        d.setId(m.getId());
        d.setName(m.getName());
        d.setDescription(m.getDescription());
        d.setClosingDateTime(m.getClosingDateTime());
        d.setItemIds(m.getItems().stream().map(Item::getId).collect(Collectors.toList()));
        return d;
    }

    @GetMapping
    public List<MenuDTO> list() {
        return menuService.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuDTO> get(@PathVariable Long id) {
        Optional<Menu> opt = menuService.findById(id);
        return opt.map(m -> ResponseEntity.ok(toDto(m))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MenuDTO> create(@Valid @RequestBody MenuDTO dto) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("MenuController.create called. Authentication: " + auth + ", authorities=" + (auth != null ? auth.getAuthorities() : "<none>"));
        Menu saved = menuService.createFromDto(dto);
        return ResponseEntity.created(URI.create("/api/menus/" + saved.getId())).body(toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuDTO> update(@PathVariable Long id, @Valid @RequestBody MenuDTO dto) {
        Menu saved = menuService.updateFromDto(id, dto);
        return ResponseEntity.ok(toDto(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        menuService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Development helper: backfill closingDateTime for menus based on description or type
    @PostMapping("/backfill-closing")
    public ResponseEntity<String> backfillClosing() {
        List<Menu> all = menuService.findAll();
        int updated = 0;
        for (Menu m : all) {
            if (m.getClosingDateTime() == null || m.getClosingDateTime().isBlank()) {
                String desc = m.getDescription() == null ? "" : m.getDescription();
                String foundDate = null;
                String foundDatetime = null;
                String foundType = null;
                String[] parts = desc.split("\\s+");
                for (String p : parts) {
                    if (foundType == null && p.toLowerCase().contains("almuerzo") || p.toLowerCase().contains("cena")) {
                        foundType = p;
                    }
                    if (foundDatetime == null && p.matches("\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}")) {
                        foundDatetime = p;
                    }
                    if (foundDate == null && p.matches("\\d{4}-\\d{2}-\\d{2}")) {
                        foundDate = p;
                    }
                }
                if (foundDatetime != null) {
                    m.setClosingDateTime(foundDatetime);
                } else if (foundDate != null) {
                    String time = (foundType != null && foundType.toLowerCase().contains("cena")) ? "19:00" : "10:00";
                    m.setClosingDateTime(foundDate + "T" + time);
                }
                if (m.getClosingDateTime() != null) {
                    menuService.save(m);
                    updated++;
                }
            }
        }
        return ResponseEntity.ok("Backfilled " + updated + " menus");
    }
}
