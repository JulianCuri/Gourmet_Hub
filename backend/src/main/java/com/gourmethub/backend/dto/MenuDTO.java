package com.gourmethub.backend.dto;

import java.util.ArrayList;
import java.util.List;

public class MenuDTO {
    private Long id;
    private String name;
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
