import React from 'react';
import './MenuCard.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { items } from '../../mock/items';

const MenuCard = ({ menu }) => {
  const mainDishes = menu.mainDishes.map(id => items.find(item => item.id === id));
  const desserts = menu.desserts.map(id => items.find(item => item.id === id));
  const carouselItems = [...mainDishes, ...desserts];

  return (
    <div className="menu-card" data-testid="menu-card">
      <Carousel
        showArrows={true}
        showThumbs={false}
        showStatus={false}
        infiniteLoop={true}
        autoPlay={false}
      >
        {carouselItems.map(item => (
          <div key={item.id}>
            <img src={item.image} alt={item.name} className="menu-card-image" />
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
