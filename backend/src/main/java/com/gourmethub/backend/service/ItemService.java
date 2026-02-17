package com.gourmethub.backend.service;

import com.gourmethub.backend.model.Item;
import com.gourmethub.backend.repository.ItemRepository;
import com.gourmethub.backend.dto.ItemDTO;
import com.gourmethub.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<Item> findAll() {
        return itemRepository.findAll();
    }

    public Optional<Item> findById(Long id) {
        return itemRepository.findById(id);
    }

    public List<Item> findByCategory(String category) {
        return itemRepository.findByCategory(category);
    }

    public Item save(Item item) {
        return itemRepository.save(item);
    }

    public Item createFromDto(ItemDTO dto) {
        Item i = new Item();
        i.setName(dto.getName());
        i.setPrice(dto.getPrice());
        i.setCategory(dto.getCategory());
        i.setImageUrl(dto.getImageUrl());
        if (dto.getCharacteristics() != null) {
            if (dto.getCharacteristics().size() > 3) {
                i.setCharacteristics(dto.getCharacteristics().subList(0, 3));
            } else {
                i.setCharacteristics(dto.getCharacteristics());
            }
        }
        Item saved = save(i);
        // Defensive: ensure characteristics are persisted as a concrete managed list
        if (dto.getCharacteristics() != null && dto.getCharacteristics().size() > 0) {
            saved.setCharacteristics(new java.util.ArrayList<>(dto.getCharacteristics().size() > 3 ? dto.getCharacteristics().subList(0,3) : dto.getCharacteristics()));
            saved = save(saved);
        }
        return saved;
    }

    public Item updateFromDto(Long id, ItemDTO dto) {
        Item existing = findById(id).orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        existing.setName(dto.getName());
        existing.setPrice(dto.getPrice());
        existing.setCategory(dto.getCategory());
        existing.setImageUrl(dto.getImageUrl());
        if (dto.getCharacteristics() != null) {
            if (dto.getCharacteristics().size() > 3) {
                existing.setCharacteristics(dto.getCharacteristics().subList(0, 3));
            } else {
                existing.setCharacteristics(dto.getCharacteristics());
            }
        } else {
            existing.setCharacteristics(new java.util.ArrayList<>());
        }
        Item saved = save(existing);
        // Defensive: ensure characteristics persisted
        if (dto.getCharacteristics() != null) {
            saved.setCharacteristics(new java.util.ArrayList<>(dto.getCharacteristics().size() > 3 ? dto.getCharacteristics().subList(0,3) : dto.getCharacteristics()));
            saved = save(saved);
        }
        return saved;
    }

    public void deleteByIdAuthorized(Long id) {
        deleteById(id);
    }

    public void deleteById(Long id) {
        itemRepository.deleteById(id);
    }

    /**
     * Development helper: set default prices for items that have null price.
     * Returns the number of items updated.
     */
    public int fixMissingPrices() {
        List<Item> all = findAll();
        int updated = 0;
        for (Item it : all) {
            if (it.getPrice() == null) {
                java.math.BigDecimal price = java.math.BigDecimal.valueOf(100);
                String cat = it.getCategory() == null ? "" : it.getCategory().toLowerCase();
                if (cat.contains("plato")) price = java.math.BigDecimal.valueOf(120);
                else if (cat.contains("bebida")) price = java.math.BigDecimal.valueOf(40);
                else if (cat.contains("postre")) price = java.math.BigDecimal.valueOf(60);
                it.setPrice(price);
                save(it);
                updated++;
            }
        }
        return updated;
    }

    /**
     * Development helper: infer and set simple characteristics for items
     * that have empty characteristics. Returns number updated.
     */
    public int fixMissingCharacteristics() {
        List<Item> all = findAll();
        int updated = 0;
        for (Item it : all) {
            java.util.List<String> chars = it.getCharacteristics();
            if (chars == null || chars.isEmpty()) {
                java.util.List<String> inferred = new java.util.ArrayList<>();
                String lower = it.getName() == null ? "" : it.getName().toLowerCase();
                if (lower.contains("ensalada") || lower.contains("verdura") || lower.contains("vegetal")) {
                    inferred.add("vegetariano");
                }
                if (lower.contains("veg") || lower.contains("medallón de verdura") || lower.contains("medallon")) {
                    if (!inferred.contains("vegano")) inferred.add("vegano");
                }
                if (lower.contains("hamburguesa") || lower.contains("picante") || lower.contains("jalape") || lower.contains("pimienta")) {
                    if (!inferred.contains("picante")) inferred.add("picante");
                }
                if (!inferred.isEmpty()) {
                    // limit to 3
                    it.setCharacteristics(inferred.size() > 3 ? inferred.subList(0,3) : inferred);
                    save(it);
                    updated++;
                }
            }
        }
        return updated;
    }
}
