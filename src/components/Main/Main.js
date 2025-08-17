
import React from 'react';
import './Main.css';
import MenuCard from '../MenuCard/MenuCard';

function Main({ menus }) {
  const sortedMenus = [...menus].sort((a, b) => new Date(a.closingDate) - new Date(b.closingDate));

  return (
    <main className="app-main">
      <div className="main-section search-section">
        <h2>Buscador</h2>
        {/* Content for search will go here */}
      </div>
      <div className="main-section categories-section">
        <h2>Categorías</h2>
        {/* Content for categories will go here */}
      </div>
      <div className="main-section menu-list-section">
        <h2>Próximos menús</h2>
        <div className="menu-list">
          {sortedMenus.map(menu => (
            <MenuCard key={menu.id} menu={menu} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Main;
