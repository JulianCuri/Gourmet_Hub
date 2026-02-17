import React from 'react';
import { Link } from 'react-router-dom';
import './ItemList.css';
import CHARACTERISTICS from '../../../constants/characteristics';

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
                        <th>Precio</th>
                        <th>Imagen</th>
                        <th>Características</th>
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
                                {item.price != null ? (`$${Number(item.price).toFixed(2)}`) : '-'}
                            </td>
                            <td>
                                {(item.image || item.imageUrl) ? (
                                    <img src={item.image || item.imageUrl} alt={item.name} style={{ width: '100px', height: 'auto' }} />
                                ) : (
                                    <img src={'/images/logo192.png'} alt="placeholder" style={{ width: '100px', height: 'auto' }} />
                                )}
                            </td>
                            <td>
                                {Array.isArray(item.characteristics) && item.characteristics.length > 0 ? (
                                    (() => {
                                        const chars = item.characteristics
                                            .map(k => CHARACTERISTICS.find(c => c.key === k))
                                            .filter(Boolean);
                                        return (
                                            <div className="char-icons" title={chars.map(c => c.label).join(', ')}>
                                                {chars.slice(0,3).map(c => (
                                                    <span key={c.key} className="char-icon" aria-hidden>{c.icon}</span>
                                                ))}
                                            </div>
                                        );
                                    })()
                                ) : ('-')}
                            </td>
                            <td className="actions-cell">
                                <Link to={`/administracion/editar-item/${item.id}`} className="btn-edit">Editar</Link>
                                <button onClick={() => handleDelete(item.id)} className="btn-delete">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="7">No hay items para mostrar.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ItemList;
