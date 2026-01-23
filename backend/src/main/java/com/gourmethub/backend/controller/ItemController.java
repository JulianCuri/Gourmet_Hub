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
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    private ItemDTO toDto(Item i) {
        ItemDTO d = new ItemDTO();
        d.setId(i.getId());
        d.setName(i.getName());
        d.setPrice(i.getPrice());
        d.setCategory(i.getCategory());
        d.setImageUrl(i.getImageUrl());
        return d;
    }

    private Item fromDto(ItemDTO d) {
        Item i = new Item();
        i.setName(d.getName());
        i.setPrice(d.getPrice());
        i.setCategory(d.getCategory());
        i.setImageUrl(d.getImageUrl());
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
    public ResponseEntity<ItemDTO> create(@Valid @RequestBody ItemDTO dto) {
        Item saved = itemService.createFromDto(dto);
        return ResponseEntity.created(URI.create("/api/items/" + saved.getId())).body(toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemDTO> update(@PathVariable Long id, @Valid @RequestBody ItemDTO dto) {
        Item saved = itemService.updateFromDto(id, dto);
        return ResponseEntity.ok(toDto(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        itemService.deleteById(id);
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
}
