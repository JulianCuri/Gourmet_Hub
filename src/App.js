
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';
import AdminPage from './pages/Admin/AdminPage';
import { menus as initialMenus } from './mock/menus'; // Import mock data
import { items as initialItems } from './mock/items';

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
      return savedMenus ? JSON.parse(savedMenus) : initialMenus;
    } catch (error) {
      console.error("Error parsing menus from localStorage", error);
      return initialMenus;
    }
  });
  const [items, setItems] = useState(() => {
    try {
      const savedItems = localStorage.getItem('items');
      return savedItems ? JSON.parse(savedItems) : initialItems;
    } catch (error) {
      console.error("Error parsing items from localStorage", error);
      return initialItems;
    }
  });

  const [nextMenuId, setNextMenuId] = useState(() => {
    try {
      const savedNextMenuId = localStorage.getItem('nextMenuId');
      if (savedNextMenuId) {
        return JSON.parse(savedNextMenuId);
      }
      const maxId = initialMenus.reduce((max, menu) => menu.id > max ? menu.id : max, 0);
      return maxId + 1;
    } catch (error) {
        console.error("Error parsing nextMenuId from localStorage", error);
        const maxId = initialMenus.reduce((max, menu) => menu.id > max ? menu.id : max, 0);
        return maxId + 1;
    }
  });

  const [nextItemId, setNextItemId] = useState(() => {
    try {
        const savedNextItemId = localStorage.getItem('nextItemId');
        if (savedNextItemId) {
        return JSON.parse(savedNextItemId);
        }
        const maxId = initialItems.reduce((max, item) => item.id > max ? item.id : max, 0);
        return maxId + 1;
    } catch (error) {
        console.error("Error parsing nextItemId from localStorage", error);
        const maxId = initialItems.reduce((max, item) => item.id > max ? item.id : max, 0);
        return maxId + 1;
    }
  });

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
    setMenus(prevMenus => [...(prevMenus || []), { ...newMenu, id: nextMenuId }]);
    setNextMenuId(prevId => prevId + 1);
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
    setMenus(prevMenus =>
      (prevMenus || []).map(menu => (menu.id === updatedMenu.id ? updatedMenu : menu))
    );
  };

  const menusWithImages = Array.isArray(menus) ? menus.map(menu => {
    const images = (menu.mainDishes || [])
      .map(dishId => (items || []).find(item => item.id === dishId))
      .filter(item => item && item.image)
      .map(item => item.image);
    return { ...menu, images };
  }) : [];

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<PublicLayout menus={menusWithImages} />} />
          <Route 
            path="/administracion/*" 
            element={<AdminPage 
                        menus={menus} 
                        addMenu={addMenu} 
                        updateMenu={updateMenu}
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
