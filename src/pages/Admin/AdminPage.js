import React from 'react';
import { Routes, Route } from 'react-router-dom';
import useWindowSize from './useWindowSize';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import MenuList from '../../components/Admin/MenuList/MenuList';
import MenuForm from '../../components/Admin/MenuForm/MenuForm';
import ItemList from '../../components/Admin/ItemList/ItemList';
import ItemForm from '../../components/Admin/ItemForm/ItemForm';

const AdminPage = ({ menus, addMenu, updateMenu, deleteMenu, items, addItem, updateItem, deleteItem }) => {
    const { width } = useWindowSize();

    if (width < 768) { // Breakpoint for mobile devices
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--primary-color)' }}>
                <h1>Panel no disponible</h1>
                <p>El panel de administración no está disponible en dispositivos móviles.</p>
            </div>
        );
    }

    return (
        <AdminLayout>
            <Routes>
                <Route path="/" element={<MenuList menus={menus} deleteMenu={deleteMenu} />} />
                <Route path="/agregar-menu" element={<MenuForm addMenu={addMenu} items={items} />} />
                <Route path="/items" element={<ItemList items={items} deleteItem={deleteItem} updateItem={updateItem} />} />
                <Route path="/agregar-item" element={<ItemForm addItem={addItem} />} />
                <Route path="/editar-menu/:id" element={<MenuForm addMenu={addMenu} updateMenu={updateMenu} items={items} menus={menus} />} />
            </Routes>
        </AdminLayout>
    );
};

export default AdminPage;