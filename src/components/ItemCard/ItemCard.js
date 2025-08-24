import React from 'react';
import './ItemCard.css';

const ItemCard = ({ item, onSelect, isSelected }) => {
    return (
        <div className={`item-card ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(item.id)}>
            <img src={item.image} alt={item.name} />
            <div className="item-card-info">
                <h4>{item.name}</h4>
            </div>
        </div>
    );
};

export default ItemCard;
