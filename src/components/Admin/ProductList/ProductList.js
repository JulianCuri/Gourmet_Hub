
import React from 'react';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = ({ products }) => {

    const handleDelete = (productId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            // In a real app, you would call a function from props to delete the product
            // e.g., deleteProduct(productId)
            alert('Funcionalidad de eliminación no implementada en este sprint.');
            console.log(`Simulating deletion of product with id: ${productId}`);
        }
    };

    return (
        <div className="product-list-container">
            <div className="list-header">
                <h1>Lista de Productos</h1>
                <Link to="/administracion/agregar-producto" className="btn-add">Agregar Producto</Link>
            </div>
            <table className="product-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Fecha de Cierre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? products.map(product => (
                        <tr key={product.id}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{new Date(product.closingDate).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                            <td className="actions-cell">
                                <button onClick={() => handleDelete(product.id)} className="btn-delete">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="4">No hay productos para mostrar.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
