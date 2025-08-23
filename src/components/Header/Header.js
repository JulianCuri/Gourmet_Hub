
import React from 'react';
import './Header.css';
import logoGH from '../../logoGH.png'; // Import the logo

function Header() {
  return (
    <header className="app-header">
      <div className="header-left">
        <a href="/" className="logo-container">
          <img src={logoGH} alt="Gourmet Hub Logo" className="logo-image" />
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
