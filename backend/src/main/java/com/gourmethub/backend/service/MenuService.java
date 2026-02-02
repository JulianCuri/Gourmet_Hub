package com.gourmethub.backend.service;

import com.gourmethub.backend.dto.MenuDTO;
import com.gourmethub.backend.exception.InvalidRequestException;
import com.gourmethub.backend.exception.ResourceNotFoundException;
import com.gourmethub.backend.model.Item;
import com.gourmethub.backend.model.Menu;
import com.gourmethub.backend.repository.ItemRepository;
import com.gourmethub.backend.repository.MenuRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MenuService {

    private final MenuRepository menuRepository;
    private final ItemRepository itemRepository;

    public MenuService(MenuRepository menuRepository, ItemRepository itemRepository) {
        this.menuRepository = menuRepository;
        this.itemRepository = itemRepository;
    }

    public List<Menu> findAll() {
        return menuRepository.findAll();
    }

    public Optional<Menu> findById(Long id) {
        return menuRepository.findById(id);
    }

    public Menu save(Menu menu) {
        return menuRepository.save(menu);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteById(Long id) {
        if (!menuRepository.existsById(id)) {
            throw new ResourceNotFoundException("Menu not found with id: " + id);
        }
        menuRepository.deleteById(id);
    }

    public List<Item> findItemsForIds(List<Long> ids) {
        return ids == null ? List.of() : ids.stream()
                .map(itemRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    public Menu createFromDto(MenuDTO dto) {
        if (dto == null) throw new InvalidRequestException("Menu data is required");
        Menu m = new Menu();
        m.setName(dto.getName());
        m.setDescription(dto.getDescription());
        m.setClosingDateTime(dto.getClosingDateTime());
        List<Item> items = findItemsForIds(dto.getItemIds());
        m.setItems(items);
        return save(m);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public Menu updateFromDto(Long id, MenuDTO dto) {
        Menu existing = findById(id).orElseThrow(() -> new ResourceNotFoundException("Menu not found with id: " + id));
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setClosingDateTime(dto.getClosingDateTime());
        List<Item> items = findItemsForIds(dto.getItemIds());
        existing.setItems(items);
        return save(existing);
    }
}
