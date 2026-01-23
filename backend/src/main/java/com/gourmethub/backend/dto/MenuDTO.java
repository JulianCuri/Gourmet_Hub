package com.gourmethub.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

public class MenuDTO {
    private Long id;

    @NotBlank(message = "El nombre del menú es obligatorio")
    @Size(max = 200, message = "El nombre del menú no puede exceder 200 caracteres")
    private String name;

    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String description;

    private List<Long> itemIds = new ArrayList<>();

    private String closingDateTime;

    public MenuDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Long> getItemIds() {
        return itemIds;
    }

    public void setItemIds(List<Long> itemIds) {
        this.itemIds = itemIds;
    }

    public String getClosingDateTime() {
        return closingDateTime;
    }

    public void setClosingDateTime(String closingDateTime) {
        this.closingDateTime = closingDateTime;
    }
}
