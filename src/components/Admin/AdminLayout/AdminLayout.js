
import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminLayout.css';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer'; // Import the Footer component

const AdminLayout = ({ children }) => {
    const checkSuperFromToken = () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) return false;
            const t = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
            const payload = t.split('.')[1];
            if (!payload) return false;
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const json = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
            if (Array.isArray(json.roles) && json.roles.includes('ROLE_SUPER_ADMIN')) return true;
            if (Array.isArray(json.authorities) && json.authorities.includes('ROLE_SUPER_ADMIN')) return true;
        } catch (e) { /* ignore */ }
        return false;
    };
    const isSuper = localStorage.getItem('authIsSuperAdmin') === '1' || checkSuperFromToken() || localStorage.getItem('authEmail') === 'superadmin@example.com';
    return (
        <div className="admin-layout">
            <Header />
            <div className="admin-main-section">
                <aside className="admin-sidebar">
                    <nav className="admin-nav">
                        <NavLink to="/administracion" end>Lista de Menús</NavLink>
                        <NavLink to="/administracion/items">Lista de Items</NavLink>
                        {isSuper ? <NavLink to="/administracion/gestionar-admins">Gestionar administradores</NavLink> : null}
                    </nav>
                </aside>
                <main className="admin-content">
                    {children}
                </main>
            </div>
            <Footer /> {/* Add the Footer component here */}
        </div>
    );
};

export default AdminLayout;
