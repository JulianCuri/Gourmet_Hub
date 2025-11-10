import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';
import AdminPage from './pages/Admin/AdminPage';
// initial data is now loaded from the backend; fall back to localStorage if backend not available
import MenuReservation from './components/MenuReservation/MenuReservation';

// This component wraps the public-facing pages
const PublicLayout = ({ menus, items }) => (
  <>
    <Header />
    <Main menus={menus} items={items} />
    <Footer />
  </>
);

function App() {
  const [menus, setMenus] = useState(() => {
    try {
      const savedMenus = localStorage.getItem('menus');
      return savedMenus ? JSON.parse(savedMenus) : [];
    } catch (error) {
      console.error("Error parsing menus from localStorage", error);
      return [];
    }
  });
  const [items, setItems] = useState(() => {
    try {
      const savedItems = localStorage.getItem('items');
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (error) {
      console.error("Error parsing items from localStorage", error);
      return [];
    }
  });

  const [nextMenuId, setNextMenuId] = useState(() => {
    try {
      const savedNextMenuId = localStorage.getItem('nextMenuId');
      if (savedNextMenuId) {
        return JSON.parse(savedNextMenuId);
      }
      return 1;
    } catch (error) {
        console.error("Error parsing nextMenuId from localStorage", error);
        return 1;
    }
  });

  const [nextItemId, setNextItemId] = useState(() => {
    try {
        const savedNextItemId = localStorage.getItem('nextItemId');
        if (savedNextItemId) {
        return JSON.parse(savedNextItemId);
        }
        return 1;
    } catch (error) {
        console.error("Error parsing nextItemId from localStorage", error);
        return 1;
    }
  });

  // On mount try to load items and menus from backend; if that fails, the app will continue
  // using values from localStorage (if any) or empty arrays.
  useEffect(() => {
    (async () => {
      try {
        const [itemsResp, menusResp] = await Promise.all([
          fetch('/api/items'),
          fetch('/api/menus')
        ]);

          if (itemsResp.ok && menusResp.ok) {
          const itemsJsonRaw = await itemsResp.json();
          const menusJson = await menusResp.json();
          // normalize items so frontend always reads `image` (fall back to imageUrl)
          const itemsJson = (itemsJsonRaw || []).map(i => ({
            ...i,
            image: i.image || i.imageUrl || null
          }));
          setItems(itemsJson);

          // Build a map for quick lookup by id
          const itemsById = (itemsJson || []).reduce((map, it) => {
            map[it.id] = it;
            return map;
          }, {});

          // Transform backend MenuDTO (id, name, description, itemIds)
          // into frontend shape expected by MenuForm (mainDishes, desserts, drinks, date, eventType, closingDateTime)
          const transformed = (menusJson || []).map(mdto => {
            const mainDishes = [];
            const desserts = [];
            const drinks = [];

            (mdto.itemIds || []).forEach(id => {
              const it = itemsById[id];
              const cat = (it && it.category) ? it.category.toLowerCase() : '';
              if (cat.includes('plato')) mainDishes.push(id);
              else if (cat.includes('postre')) desserts.push(id);
              else if (cat.includes('bebida')) drinks.push(id);
              else {
                // fallback: if we can't determine category, put into mainDishes
                mainDishes.push(id);
              }
            });

            // Parse description for eventType and date/closingDateTime when present
            let date = undefined;
            let eventType = undefined;
            let closingDateTime = undefined;
            if (mdto.description) {
              // e.g. "Cena 2025-10-13" or "almuerzo 2025-11-15 2025-11-15T17:55"
              const parts = mdto.description.split(/\s+/).filter(Boolean);
              if (parts.length >= 1) eventType = parts[0];
              // find an ISO date-like token
              const dateToken = parts.find(p => /\d{4}-\d{2}-\d{2}/.test(p));
              if (dateToken) date = dateToken;
              // find datetime token with T
              const dtToken = parts.find(p => /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(p));
              if (dtToken) closingDateTime = dtToken;
              // fallback: if we have a date but no explicit datetime, set midnight of that date
              if (!closingDateTime && date) {
                closingDateTime = `${date}T00:00`;
              }
            }

            return {
              id: mdto.id,
              name: mdto.name,
              description: mdto.description,
              mainDishes,
              desserts,
              drinks,
              date,
              eventType,
              closingDateTime
            };
          });

          setMenus(transformed);
          const maxMenuId = Array.isArray(transformed) ? transformed.reduce((max, m) => (m.id > max ? m.id : max), 0) : 0;
          setNextMenuId(maxMenuId + 1);
          const maxItemId = Array.isArray(itemsJson) ? itemsJson.reduce((max, i) => (i.id > max ? i.id : max), 0) : 0;
          setNextItemId(maxItemId + 1);
        } else {
          console.warn('Backend returned non-ok for items/menus; using local data if available');
        }
      } catch (err) {
        console.warn('Failed to fetch items/menus from backend, continuing with local data', err);
      }
    })();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('menus', JSON.stringify(menus));
    } catch (error) {
      console.error("Error saving menus to localStorage", error);
    }
  }, [menus]);

  useEffect(() => {
    try {
      localStorage.setItem('items', JSON.stringify(items));
    } catch (error) {
      console.error("Error saving items to localStorage", error);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem('nextMenuId', JSON.stringify(nextMenuId));
    } catch (error) {
      console.error("Error saving nextMenuId to localStorage", error);
    }
  }, [nextMenuId]);

  useEffect(() => {
    try {
      localStorage.setItem('nextItemId', JSON.stringify(nextItemId));
    } catch (error) {
      console.error("Error saving nextItemId to localStorage", error);
    }
  }, [nextItemId]);

  const addMenu = (newMenu) => {
    // Persist to backend and then update local state with created id
    (async () => {
      try {
        const itemIds = [
          ...(newMenu.mainDishes || []),
          ...(newMenu.desserts || []),
          ...(newMenu.drinks || []),
        ];
        const dto = {
          name: newMenu.name,
          description: `${newMenu.eventType || ''} ${newMenu.date || ''} ${newMenu.closingDateTime || ''}`.trim(),
          closingDateTime: newMenu.closingDateTime,
          itemIds,
        };

        const resp = await fetch('/api/menus', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dto),
        });

        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(text || `HTTP ${resp.status}`);
        }

        const created = await resp.json();
        // Merge backend id into frontend menu shape
        const menuWithId = { ...newMenu, id: created.id };
        setMenus(prevMenus => [...(prevMenus || []), menuWithId]);
        setNextMenuId(prevId => prevId + 1);
      } catch (err) {
        console.error('Failed to save menu to backend:', err);
        // fallback to local-only save so user doesn't lose work
        setMenus(prevMenus => [...(prevMenus || []), { ...newMenu, id: nextMenuId }]);
        setNextMenuId(prevId => prevId + 1);
      }
    })();
  };

  const addItem = (newItem) => {
    const isDuplicate = (items || []).some(
        item => item.name.trim().toLowerCase() === newItem.name.trim().toLowerCase()
    );

    if (isDuplicate) {
        alert('Ya existe un item con este nombre.');
        return false;
    }

    setItems(prevItems => [...(prevItems || []), { ...newItem, id: nextItemId }]);
    setNextItemId(prevId => prevId + 1);
    return true;
  };

  const deleteItem = (itemId) => {
    setItems((prevItems) => (prevItems || []).filter(item => item.id !== itemId));
  };

  const updateMenu = (updatedMenu) => {
    // Persist update to backend, then update local state
    (async () => {
      try {
        const itemIds = [
          ...(updatedMenu.mainDishes || []),
          ...(updatedMenu.desserts || []),
          ...(updatedMenu.drinks || []),
        ];
        const dto = {
          name: updatedMenu.name,
          description: `${updatedMenu.eventType || ''} ${updatedMenu.date || ''}`.trim(),
          itemIds,
          closingDateTime: updatedMenu.closingDateTime || updatedMenu.closingDate || undefined
        };

        const resp = await fetch(`/api/menus/${updatedMenu.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dto),
        });

        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(text || `HTTP ${resp.status}`);
        }

        const saved = await resp.json();
        // Convert saved DTO to frontend shape
        const newMenu = {
          id: saved.id,
          name: saved.name,
          description: saved.description,
          mainDishes: saved.itemIds || [],
          desserts: [],
          drinks: [],
          date: '',
          eventType: '',
          closingDateTime: saved.closingDateTime
        };
        // try to infer date/eventType from description like earlier
        if (saved.description) {
          const parts = saved.description.split(/\s+/).filter(Boolean);
          if (parts.length >= 1) newMenu.eventType = parts[0];
          const dateToken = parts.find(p => /\d{4}-\d{2}-\d{2}/.test(p));
          if (dateToken) newMenu.date = dateToken;
        }

        setMenus(prevMenus => (prevMenus || []).map(menu => (menu.id === newMenu.id ? { ...menu, ...newMenu } : menu)));
      } catch (err) {
        console.error('Failed to update menu on backend:', err);
        // fallback to local update
        setMenus(prevMenus => (prevMenus || []).map(menu => (menu.id === updatedMenu.id ? updatedMenu : menu)));
      }
    })();
  };

  const deleteMenu = (menuId) => {
    setMenus((prevMenus) => (prevMenus || []).filter(menu => menu.id !== menuId));
  };

  const menusWithImages = Array.isArray(menus) ? menus.map(menu => {
    const images = (menu.mainDishes || [])
            .map(dishId => (items || []).find(item => item.id === dishId))
            .filter(item => item && (item.image || item.imageUrl))
            .map(item => item.image || item.imageUrl);
    return { ...menu, images };
  }) : [];

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<PublicLayout menus={menusWithImages} items={items} />} />
          <Route path="/menu/:id" element={<MenuReservation menus={menus} items={items} />} />
          <Route 
            path="/administracion/*" 
            element={<AdminPage 
                        menus={menus} 
                        addMenu={addMenu} 
                        updateMenu={updateMenu}
                        deleteMenu={deleteMenu}
                        items={items}
                        addItem={addItem}
                        deleteItem={deleteItem}
                      />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;