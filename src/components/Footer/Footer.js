
import React from 'react';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <div className="footer-left">
        <span className="logo-text-footer">Gourmet Hub</span>
        <span className="copyright">&copy; {currentYear} Gourmet Hub. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}

export default Footer;
