package com.gourmethub.backend.service;

import com.gourmethub.backend.model.Item;
import com.gourmethub.backend.model.Menu;
import com.gourmethub.backend.repository.ItemRepository;
import com.gourmethub.backend.repository.MenuRepository;
import org.springframework.stereotype.Service;

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

    public void deleteById(Long id) {
        menuRepository.deleteById(id);
    }

    public List<Item> findItemsForIds(List<Long> ids) {
        return ids == null ? List.of() : ids.stream()
                .map(itemRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }
}
