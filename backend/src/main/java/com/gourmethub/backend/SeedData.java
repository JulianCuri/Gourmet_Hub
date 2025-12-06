package com.gourmethub.backend;

import com.gourmethub.backend.model.Item;
import com.gourmethub.backend.model.Menu;
import com.gourmethub.backend.service.ItemService;
import com.gourmethub.backend.service.MenuService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class SeedData {

    @Bean
    CommandLineRunner init(ItemService itemService, MenuService menuService) {
        return args -> {
            // Seed items if none exist (based on gourmet-hub/src/mock/items.js)
            if (itemService.findAll().isEmpty()) {
                String[][] raw = new String[][]{
                        {"ESCALOPE CON ENSALADA","Plato Principal","/images/principales/principal1.jpg"},
                        {"TERNERA GUISADA","Plato Principal","/images/principales/principal2.jpg"},
                        {"CARNE CON FRITAS","Plato Principal","/images/principales/principal3.jpg"},
                        {"MILANESA NAPOLITANA CON PURÉ","Plato Principal","/images/principales/principal4.jpg"},
                        {"HAMBURGUESA COMPLETA CON FRITAS","Plato Principal","/images/principales/principal5.jpg"},
                        {"MEDALLÓN DE VERDURA CON CALABAZA","Plato Principal","/images/principales/principal6.jpeg"},
                        {"POLLO AL HORNO CON ENSALADA","Plato Principal","/images/principales/principal7.jpg"},
                        {"TARTA DE JAMÓN Y QUESO","Plato Principal","/images/principales/principal8.jpg"},
                        {"FIDEOS DE ESPINACA CON SALSA ROSA","Plato Principal","/images/principales/principal9.jpg"},
                        {"PIZZA DE JAMÓN Y MORRON","Plato Principal","/images/principales/principal10.jpg"},
                        {"ENSALADA COMPLETA CON ATÚN","Plato Principal","/images/principales/principal11.jpg"},
                        {"ENSALADA COMPLETA CON JAMÓN Y QUESO","Plato Principal","/images/principales/principal12.jpeg"},
                        {"ENSALADA CESAR","Plato Principal","/images/principales/principal13.jpg"},
                        {"ENSALADA COMPLETA CON POLLO","Plato Principal","/images/principales/principal14.jpg"},
                        {"ENSALADA COMPLETA CON SEMILLAS","Plato Principal","/images/principales/principal15.jpg"},
                        {"AGUA SIN GAS","Bebida","/images/bebidas/bebida1.jpeg"},
                        {"AGUA CON GAS","Bebida","/images/bebidas/bebida2.jpeg"},
                        {"BEBIDA LIGHT","Bebida","/images/bebidas/bebida3.jpeg"},
                        {"SABORIZADA MANZANA","Bebida","/images/bebidas/bebida4.jpeg"},
                        {"SABORIZADA DE POMELO","Bebida","/images/bebidas/bebida5.jpeg"},
                        {"DURAZNO AL ALMÍBAR","Postre","/images/postres/postre1.jpeg"},
                        {"ALFAJOR","Postre","/images/postres/postre2.jpeg"},
                        {"BUDÍN","Postre","/images/postres/postre3.jpeg"},
                        {"FLAN","Postre","/images/postres/postre4.jpeg"},
                        {"GELATINA","Postre","/images/postres/postre5.jpeg"},
                        {"BANANA","Postre","/images/postres/postre6.jpeg"},
                        {"MANZANA","Postre","/images/postres/postre7.jpeg"}
                };

                for (String[] r : raw) {
                    Item it = new Item();
                    it.setName(r[0]);
                    it.setCategory(r[1]);
                    it.setImageUrl(r[2]);
                    BigDecimal price = BigDecimal.valueOf(100);
                    if (r[1].toLowerCase().contains("plato")) price = BigDecimal.valueOf(120);
                    else if (r[1].toLowerCase().contains("bebida")) price = BigDecimal.valueOf(40);
                    else if (r[1].toLowerCase().contains("postre")) price = BigDecimal.valueOf(60);
                    it.setPrice(price);
                    itemService.save(it);
                }
                System.out.println("Seeded items from frontend mock data");
            }

            // Seed menus if none exist (based on gourmet-hub/src/mock/menus.js)
            if (menuService.findAll().isEmpty()) {
                int[][] menuDefs = new int[][]{
                        {15,1,14, 27,26,25, 19,16,17},
                        {10,13,11, 24,21,23, 18,16,20},
                        {1,12,14, 22,27,21, 17,19,16},
                        {13,15,11, 25,23,24, 20,18,17},
                        {12,10,1, 21,22,27, 16,19,18}
                };

                String[] names = new String[]{
                        "Menú Cena Lunes 13/10",
                        "Menú Cena Martes 14/10",
                        "Menú Almuerzo Miércoles 15/10",
                        "Menú Almuerzo Jueves 16/10",
                        "Menú Almuerzo Viernes 17/10"
                };

                String[] dates = new String[]{"2025-10-13","2025-10-14","2025-10-15","2025-10-16","2025-10-17"};
                String[] types = new String[]{"Cena","Cena","Almuerzo","Almuerzo","Almuerzo"};

                for (int i = 0; i < menuDefs.length; i++) {
                    Menu m = new Menu();
                    m.setName(names[i]);
                    m.setDescription(types[i] + " " + dates[i]);
                    // Set default closing time: Almuerzo -> 10:00, Cena -> 19:00
                    String time = types[i].toLowerCase().contains("cena") ? "19:00" : "10:00";
                    m.setClosingDateTime(dates[i] + "T" + time);
                    int[] def = menuDefs[i];
                    List<Long> ids = new ArrayList<>();
                    for (int id : def) ids.add((long) id);
                    m.setItems(menuService.findItemsForIds(ids));
                    menuService.save(m);
                }
                System.out.println("Seeded menus from frontend mock data");
            }
            // Fix-up existing menus that may lack closingDateTime (e.g., previously seeded data)
            List<Menu> existing = menuService.findAll();
            for (Menu m : existing) {
                if (m.getClosingDateTime() == null || m.getClosingDateTime().isBlank()) {
                    String desc = m.getDescription() == null ? "" : m.getDescription();
                    String foundDate = null;
                    String foundDatetime = null;
                    String foundType = null;
                    String[] parts = desc.split("\\s+");
                    for (String p : parts) {
                        if (foundType == null && p.matches("(?i)almuerzo|cena")) {
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
                    // persist if we set something
                    if (m.getClosingDateTime() != null) {
                        menuService.save(m);
                    }
                }
            }
        };
    }
}
