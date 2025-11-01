
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import logoGH from '../../logoGH.png'; // Import the logo

function getCurrentUser() {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}



function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.reload();
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <a href="/" className="logo-container">
          <img src={logoGH} alt="Gourmet Hub Logo" className="logo-image" />
          <span className="slogan">Tu comedor corporativo</span>
        </a>
      </div>
      <div className="header-right">
        {user ? (
          <div className="user-info-header">
            <span className="user-avatar user-avatar-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="16" fill="#e0e0e0"/>
                <circle cx="16" cy="13" r="6" fill="#bdbdbd"/>
                <ellipse cx="16" cy="24" rx="9" ry="6" fill="#bdbdbd"/>
              </svg>
            </span>
            <span className="user-name">{user.nombre} {user.apellido}</span>
            {user.rol === 'admin' && (
              location.pathname.startsWith('/administracion') ? (
                <button className="btn btn-primary" style={{marginLeft: '0.5rem'}} onClick={() => navigate('/')}>Página principal</button>
              ) : (
                <button className="btn btn-primary" style={{marginLeft: '0.5rem'}} onClick={() => navigate('/administracion')}>Panel Admin</button>
              )
            )}
            <button className="btn btn-secondary" onClick={handleLogout}>Cerrar sesión</button>
          </div>
        ) : (
          <>
            <button className="btn btn-secondary" onClick={() => navigate('/register')}>Crear cuenta</button>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Iniciar sesión</button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
