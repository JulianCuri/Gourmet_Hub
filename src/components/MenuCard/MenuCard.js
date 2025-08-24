import React from 'react';
import './MenuCard.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const MenuCard = ({ menu }) => {
  return (
    <div className="menu-card" data-testid="menu-card">
      <Carousel
        showArrows={true}
        showThumbs={false}
        showStatus={false}
        infiniteLoop={true}
        autoPlay={false}
      >
        {menu.images && menu.images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={menu.name} className="menu-card-image" />
          </div>
        ))}
      </Carousel>
      <div className="menu-card-content">
        <h3 className="menu-card-name">{menu.name}</h3>
        <p className="menu-card-closing-date">Fecha de cierre: {new Date(menu.closingDateTime).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default MenuCard;
