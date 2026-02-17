import React from 'react';
import './ItemCard.css';
import CHARACTERISTICS from '../../constants/characteristics';

const ItemCard = ({ item, onSelect, isSelected }) => {
    const chars = Array.isArray(item.characteristics)
        ? item.characteristics.map(k => CHARACTERISTICS.find(c => c.key === k)).filter(Boolean)
        : [];

    return (
        <div className={`item-card ${isSelected ? 'selected' : ''}`} onClick={() => onSelect(item.id)}>
                {chars.length > 0 && (
                    <div className="char-tooltip">
                        {chars.map(c => (
                            <div key={c.key} className="char-chip">
                                <span className="char-icon">{c.icon}</span>
                                <span className="char-label">{c.label}</span>
                            </div>
                        ))}
                    </div>
                )}
                <div className="item-card-img-container">
                    <img src={item.image || item.imageUrl || '/images/logo192.png'} alt={item.name} />
                </div>
            <div className="item-card-info">
                <h4>{item.name}</h4>
            </div>
        </div>
    );
};

export default ItemCard;
