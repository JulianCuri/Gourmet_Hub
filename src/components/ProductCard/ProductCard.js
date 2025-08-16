import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150'; // Placeholder image

  return (
    <div className="product-card" data-testid="product-card">
      <img src={imageUrl} alt={product.name} className="product-card-image" />
      <div className="product-card-content">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-closing-date">Fecha de cierre: {new Date(product.closingDate).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ProductCard;