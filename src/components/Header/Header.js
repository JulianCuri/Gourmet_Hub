
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import logoGH from '../../logoGH.png'; // Import the logo

function Header() {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const read = () => setEmail(localStorage.getItem('authEmail'));
    read();
    const onAuth = () => read();
    window.addEventListener('authChanged', onAuth);
    // listen for storage events (when auth changed in another tab)
    const onStorage = (ev) => { if (ev.key === 'authEmail' || ev.key === 'authToken' || ev.key === 'authName' || ev.key === 'authInitials') read(); };
    window.addEventListener('storage', onStorage);
    return () => { window.removeEventListener('authChanged', onAuth); window.removeEventListener('storage', onStorage); };
  }, []);

  // detect admin role by decoding JWT payload (best-effort)
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [authName, setAuthName] = useState(null);
  const [authInitials, setAuthInitials] = useState(null);

  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem('authToken');
      if (!token) { setIsAdmin(false); return; }
      const t = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
      try {
        const payload = t.split('.')[1];
        // base64url -> base64
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const json = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
        // common claim names: roles, authorities
        if (Array.isArray(json.roles) && json.roles.includes('ROLE_ADMIN')) { setIsAdmin(true); return; }
        if (Array.isArray(json.authorities) && json.authorities.includes('ROLE_ADMIN')) { setIsAdmin(true); return; }
        // some tokens include 'role' or 'roles' as string
        if (typeof json.role === 'string' && json.role.toLowerCase().includes('admin')) { setIsAdmin(true); return; }
        if (typeof json.roles === 'string' && json.roles.toLowerCase().includes('admin')) { setIsAdmin(true); return; }
      } catch (e) {
        // ignore parse errors
      }
      setIsAdmin(false);
    };
    checkAdmin();
    const onAuth = () => checkAdmin();
    window.addEventListener('authChanged', onAuth);
    window.addEventListener('storage', onAuth);
    return () => { window.removeEventListener('authChanged', onAuth); window.removeEventListener('storage', onAuth); };
  }, []);

  useEffect(() => {
    setAuthName(localStorage.getItem('authName'));
    setAuthInitials(localStorage.getItem('authInitials'));
    const onAuth = () => { setAuthName(localStorage.getItem('authName')); setAuthInitials(localStorage.getItem('authInitials')); };
    window.addEventListener('authChanged', onAuth);
    window.addEventListener('storage', onAuth);
    return () => { window.removeEventListener('authChanged', onAuth); window.removeEventListener('storage', onAuth); };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authEmail');
    try { window.dispatchEvent(new Event('authChanged')); } catch (e) {}
    setEmail(null);
    // navigate to home
    window.location.href = '/';
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
        {email ? (
          <div className="header-connected">
            {/* show admin panel button only on main page and when user has admin role */}
            {isAdmin && location && location.pathname === '/' ? (
              <button className="btn btn-admin-panel" onClick={() => navigate('/administracion')}>Ir a panel</button>
            ) : null}
            <div className="header-avatar-block">
              <div className="avatar">{authInitials || (authName ? authName.split(/\s+/).map(n=>n[0]).slice(0,2).join('').toUpperCase() : '')}</div>
              <div className="avatar-info">
                <div className="connected-text">{authName || email}</div>
                <button className="btn btn-ghost btn-logout" onClick={handleLogout}>Cerrar sesión</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <a href="/register"><button className="btn btn-secondary">Crear cuenta</button></a>
            <a href="/administracion/login"><button className="btn btn-primary">Iniciar sesión</button></a>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
