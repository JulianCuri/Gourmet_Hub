import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotAuthorizedAdmin.css';

const NotAuthorizedAdmin = ({ message = null }) => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    // just navigate back to the public main page without altering current auth
    navigate('/');
  };

  const handleLogout = () => {
    // clear current auth and go to admin login (user can re-login as admin or any other account)
    localStorage.removeItem('authToken');
    localStorage.removeItem('authEmail');
    localStorage.removeItem('authName');
    localStorage.removeItem('authInitials');
    try { window.dispatchEvent(new Event('authChanged')); } catch (e) {}
    navigate('/administracion/login');
  };

  const defaultMessage = 'Estás autenticado, pero no tenés permisos para acceder al panel de administración.';
  const displayMessage = message || defaultMessage;

  return (
    <div className="not-authorized-container">
      <h2>Acceso denegado</h2>
      <p>{displayMessage}</p>
      <p>Podes volver a la página principal o cerrar sesión.</p>
      <div className="actions">
        <button className="btn-back" onClick={handleReturnHome}>Volver al inicio</button>
        <button className="btn-submit" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
};

export default NotAuthorizedAdmin;
