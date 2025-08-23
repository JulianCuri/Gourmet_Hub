import React from 'react';
import './Footer.css';
import logoGH from '../../logoGH.png'; // Import the logo

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <div className="footer-left">
        <div className="logo-container">
          <img src={logoGH} alt="Gourmet Hub Logo" className="footer-logo" />
        </div>
        <span className="logo-text-footer">Gourmet Hub</span> {/* Added back the text */}
        <span className="copyright">&copy; {currentYear} Gourmet Hub. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}

export default Footer;