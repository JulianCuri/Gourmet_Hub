
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';
import AdminPage from './pages/Admin/AdminPage';
import { menus as initialMenus } from './mock/menus'; // Import mock data
import { items as initialItems } from './mock/items';

// This component wraps the public-facing pages
const PublicLayout = ({ menus }) => (
  <>
    <Header />
    <Main menus={menus} />
    <Footer />
  </>
);

function App() {
  const [menus, setMenus] = useState(initialMenus);
  const [items, setItems] = useState(initialItems);

  const [nextMenuId, setNextMenuId] = useState(() => {
    const maxId = initialMenus.reduce((max, menu) => menu.id > max ? menu.id : max, 0);
    return maxId + 1;
  });

  const [nextItemId, setNextItemId] = useState(() => {
    const maxId = initialItems.reduce((max, item) => item.id > max ? item.id : max, 0);
    return maxId + 1;
  });

  const addMenu = (newMenu) => {
    setMenus(prevMenus => [...prevMenus, { ...newMenu, id: nextMenuId }]);
    setNextMenuId(prevId => prevId + 1);
  };

  const addItem = (newItem) => {
    const isDuplicate = items.some(
        item => item.name.trim().toLowerCase() === newItem.name.trim().toLowerCase()
    );

    if (isDuplicate) {
        alert('Ya existe un item con este nombre.');
        return false;
    }

    setItems(prevItems => [...prevItems, { ...newItem, id: nextItemId }]);
    setNextItemId(prevId => prevId + 1);
    return true;
  };

  const deleteItem = (itemId) => {
    setItems((prevItems) => prevItems.filter(item => item.id !== itemId));
  };

  const updateMenu = (updatedMenu) => {
    setMenus(prevMenus =>
      prevMenus.map(menu => (menu.id === updatedMenu.id ? updatedMenu : menu))
    );
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<PublicLayout menus={menus} />} />
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
