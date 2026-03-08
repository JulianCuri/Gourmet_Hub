import React from 'react';
import './ItemCard.css';
import CHARACTERISTICS from '../../constants/characteristics';

const ItemCard = ({ item, onSelect, isSelected }) => {
    const chars = Array.isArray(item.characteristics)
        ? item.characteristics
            .map((ch) => {
                // New format: object from backend { id, name, icon }
                if (ch && typeof ch === 'object') {
                    const label = ch.name || ch.label || '';
                    const icon = ch.icon || '';
                    if (!label && !icon) return null;
                    return {
                        key: ch.id || ch.key || `${label}-${icon}`,
                        label,
                        icon,
                    };
                }

                // Legacy format: string key mapped against constants
                if (typeof ch === 'string') {
                    const legacy = CHARACTERISTICS.find((c) => c.key === ch);
                    if (!legacy) return null;
                    return {
                        key: legacy.key,
                        label: legacy.label,
                        icon: legacy.icon,
                    };
                }

                return null;
            })
            .filter(Boolean)
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
