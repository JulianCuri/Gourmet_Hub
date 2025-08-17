
import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h2 className="admin-title">Gourmet Hub</h2>
                <p className="admin-subtitle">Panel de Administración</p>
                <nav className="admin-nav">
                    <NavLink to="/administracion" end>Lista de Menús</NavLink>
                    <NavLink to="/administracion/items">Lista de Items</NavLink>
                </nav>
            </aside>
            <main className="admin-content">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
