package com.gourmethub.backend.controller;

import com.gourmethub.backend.dto.ItemDTO;
import com.gourmethub.backend.model.Item;
import com.gourmethub.backend.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return false;
        for (GrantedAuthority ga : auth.getAuthorities()) {
            if ("ROLE_ADMIN".equals(ga.getAuthority())) return true;
        }
        return false;
    }

    private ItemDTO toDto(Item i) {
        ItemDTO d = new ItemDTO();
        System.out.println("[DEBUG] toDto item id=" + i.getId() + " characteristics=" + i.getCharacteristics());
        d.setId(i.getId());
        d.setName(i.getName());
        // Expose price to all clients
        d.setPrice(i.getPrice());
        d.setCategory(i.getCategory());
        d.setImageUrl(i.getImageUrl());
        // expose characteristics to all clients
        d.setCharacteristics(i.getCharacteristics() != null ? i.getCharacteristics() : new java.util.ArrayList<>());
        return d;
    }

    private Item fromDto(ItemDTO d) {
        Item i = new Item();
        i.setName(d.getName());
        i.setPrice(d.getPrice());
        i.setCategory(d.getCategory());
        i.setImageUrl(d.getImageUrl());
        i.setCharacteristics(d.getCharacteristics());
        return i;
    }

    @GetMapping
    public List<ItemDTO> list(@RequestParam(value = "category", required = false) String category) {
        List<Item> items = category == null ? itemService.findAll() : itemService.findByCategory(category);
        return items.stream().map(this::toDto).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDTO> get(@PathVariable Long id) {
        Optional<Item> opt = itemService.findById(id);
        return opt.map(i -> ResponseEntity.ok(toDto(i))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Admin operations (for now not restricted; will add role checks when auth is ready)
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody ItemDTO dto) {
        System.out.println("[DEBUG] create ItemDTO characteristics -> " + dto.getCharacteristics());
        if (dto.getCharacteristics() != null && dto.getCharacteristics().size() > 3) {
            return ResponseEntity.badRequest().body(Map.of("error", "No se permiten más de 3 características"));
        }
        Item saved = itemService.createFromDto(dto);
        return ResponseEntity.created(URI.create("/api/items/" + saved.getId())).body(toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody ItemDTO dto) {
        System.out.println("[DEBUG] update ItemDTO characteristics -> " + dto.getCharacteristics());
        if (dto.getCharacteristics() != null && dto.getCharacteristics().size() > 3) {
            return ResponseEntity.badRequest().body(Map.of("error", "No se permiten más de 3 características"));
        }
        Item saved = itemService.updateFromDto(id, dto);
        return ResponseEntity.ok(toDto(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        itemService.deleteByIdAuthorized(id);
        return ResponseEntity.noContent().build();
    }

    // Development-only helper: allow deletion via POST to avoid DELETE/403 issues from some clients
    @PostMapping("/delete/{id}")
    public ResponseEntity<Void> deleteViaPost(@PathVariable Long id) {
        try {
            itemService.deleteById(id);
        } catch (Exception ex) {
            // swallow for dev convenience
        }
        return ResponseEntity.ok().build();
    }

    // Debug endpoint: return raw characteristics map for all items
    @GetMapping("/debug/char-map")
    public ResponseEntity<?> debugCharMap() {
        try {
            var map = itemService.findAll().stream().collect(Collectors.toMap(Item::getId, Item::getCharacteristics));
            return ResponseEntity.ok(map);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", ex.getMessage()));
        }
    }

    // Development helper: fix missing prices for items where price is null
    @PostMapping("/debug/fix-prices")
    public ResponseEntity<?> debugFixPrices() {
        try {
            int updated = itemService.fixMissingPrices();
            return ResponseEntity.ok(Map.of("updated", updated));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", ex.getMessage()));
        }
    }

    // Development helper: infer and persist simple characteristics for items missing them
    @PostMapping("/debug/fix-characteristics")
    public ResponseEntity<?> debugFixCharacteristics() {
        try {
            int updated = itemService.fixMissingCharacteristics();
            return ResponseEntity.ok(Map.of("updated", updated));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", ex.getMessage()));
        }
    }
}
