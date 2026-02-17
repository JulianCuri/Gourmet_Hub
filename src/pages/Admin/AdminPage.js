import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import useWindowSize from './useWindowSize';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import MenuList from '../../components/Admin/MenuList/MenuList';
import MenuForm from '../../components/Admin/MenuForm/MenuForm';
import ItemList from '../../components/Admin/ItemList/ItemList';
import ItemForm from '../../components/Admin/ItemForm/ItemForm';
import Login from '../../components/Auth/Login';
import ManageAdmins from '../../components/Admin/ManageAdmins/ManageAdmins';

const AdminPage = ({ menus, addMenu, updateMenu, deleteMenu, items, addItem, updateItem, deleteItem }) => {
    const { width } = useWindowSize();
    const location = useLocation();

    if (width < 768) { // Breakpoint for mobile devices
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--primary-color)' }}>
                <h1>Panel no disponible</h1>
                <p>El panel de administración no está disponible en dispositivos móviles.</p>
            </div>
        );
    }

    // If we're on the admin login route, render the Login page without the AdminLayout
    if (location && location.pathname && location.pathname.endsWith('/login')) {
        return <Login />;
    }

    return (
        <AdminLayout>
            <Routes>
                <Route path="/" element={<MenuList menus={menus} deleteMenu={deleteMenu} />} />
                <Route path="/agregar-menu" element={<MenuForm addMenu={addMenu} items={items} />} />
                <Route path="/items" element={<ItemList items={items} deleteItem={deleteItem} updateItem={updateItem} />} />
                <Route path="/agregar-item" element={<ItemForm addItem={addItem} />} />
                <Route path="/editar-item/:id" element={<ItemForm addItem={addItem} updateItem={updateItem} items={items} />} />
                <Route path="/editar-menu/:id" element={<MenuForm addMenu={addMenu} updateMenu={updateMenu} items={items} menus={menus} />} />
                <Route path="/gestionar-admins" element={<ManageAdmins />} />
            </Routes>
        </AdminLayout>
    );
};

export default AdminPage;