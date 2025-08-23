
import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminLayout.css';
import Header from '../../Header/Header';
import Footer from '../../Footer/Footer'; // Import the Footer component

const AdminLayout = ({ children }) => {
    return (
        <div className="admin-layout">
            <Header />
            <div className="admin-main-section">
                <aside className="admin-sidebar">
                    
                    <nav className="admin-nav">
                        <NavLink to="/administracion" end>Lista de Menús</NavLink>
                        <NavLink to="/administracion/items">Lista de Items</NavLink>
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
