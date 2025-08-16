
import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="header-left">
        <a href="/" className="logo-container">
          {/* Placeholder for logo image */}
          <span className="logo-text">Gourmet Hub</span>
          <span className="slogan">Tu comedor corporativo</span>
        </a>
      </div>
      <div className="header-right">
        <button className="btn btn-secondary">Crear cuenta</button>
        <button className="btn btn-primary">Iniciar sesión</button>
      </div>
    </header>
  );
}

export default Header;
