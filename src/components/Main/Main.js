
import React from 'react';
import './Main.css';
import ProductCard from '../ProductCard/ProductCard';

function Main({ products }) {
  const sortedProducts = [...products].sort((a, b) => new Date(a.closingDate) - new Date(b.closingDate));

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
      <div className="main-section product-list-section">
        <h2>Próximos menús</h2>
        <div className="product-list">
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Main;
