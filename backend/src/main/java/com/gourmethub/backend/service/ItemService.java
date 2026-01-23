package com.gourmethub.backend.service;

import com.gourmethub.backend.model.Item;
import com.gourmethub.backend.repository.ItemRepository;
import com.gourmethub.backend.dto.ItemDTO;
import com.gourmethub.backend.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

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
        return save(i);
    }

    public Item updateFromDto(Long id, ItemDTO dto) {
        Item existing = findById(id).orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        existing.setName(dto.getName());
        existing.setPrice(dto.getPrice());
        existing.setCategory(dto.getCategory());
        existing.setImageUrl(dto.getImageUrl());
        return save(existing);
    }

    public void deleteById(Long id) {
        itemRepository.deleteById(id);
    }
}
