import React from 'react';
import './MenuCard.css';

const MenuCard = ({ menu }) => {
  const imageUrl = menu.images && menu.images.length > 0 ? menu.images[0] : 'https://via.placeholder.com/150'; // Placeholder image

  return (
    <div className="menu-card" data-testid="menu-card">
      <img src={imageUrl} alt={menu.name} className="menu-card-image" />
      <div className="menu-card-content">
        <h3 className="menu-card-name">{menu.name}</h3>
        <p className="menu-card-closing-date">Fecha de cierre: {new Date(menu.closingDate).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default MenuCard;
