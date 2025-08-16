
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import useWindowSize from './useWindowSize';
import AdminLayout from '../../components/Admin/AdminLayout/AdminLayout';
import ProductList from '../../components/Admin/ProductList/ProductList';
import ProductForm from '../../components/Admin/ProductForm/ProductForm';

const AdminPage = ({ products, addProduct }) => {
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
                <Route path="/" element={<ProductList products={products} />} />
                <Route path="/agregar-producto" element={<ProductForm addProduct={addProduct} />} />
            </Routes>
        </AdminLayout>
    );
};

export default AdminPage;
