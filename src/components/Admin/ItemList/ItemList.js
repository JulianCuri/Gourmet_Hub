import React from 'react';
import { Link } from 'react-router-dom';
import './ItemList.css';

const ItemList = ({ items, deleteItem }) => {

    const handleDelete = (itemId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este item?')) {
            deleteItem(itemId);
        }
    };

    const capitalize = (str) => {
        if (!str) return str;
        return str.replace(/\b\w/g, char => char.toUpperCase());
    };

    return (
        <div className="item-list-container">
            <div className="list-header">
                <h1>Lista de Items</h1>
                <Link to="/administracion/agregar-item" className="btn-add">Agregar Item</Link>
            </div>
            <table className="item-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Imagen</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 ? items.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{capitalize(item.category)}</td>
                            <td>
                                {item.image && <img src={item.image} alt={item.name} style={{ width: '100px', height: 'auto' }} />}
                            </td>
                            <td className="actions-cell">
                                <button onClick={() => handleDelete(item.id)} className="btn-delete">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5">No hay items para mostrar.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ItemList;
