import React from 'react';
import { Link } from 'react-router-dom';
import './MenuList.css';

const MenuList = ({ menus, deleteMenu }) => {

    const handleDelete = (menuId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este menú?')) {
            deleteMenu(menuId);
        }
    };

    return (
        <div className="menu-list-container">
            <div className="list-header">
                <h1>Lista de Menús</h1>
                <Link to="/administracion/agregar-menu" className="btn-add">Agregar Menú</Link>
            </div>
            <table className="menu-table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Fecha de Cierre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {menus.length > 0 ? menus.map(menu => (
                        <tr key={menu.id}>
                            <td>{menu.id}</td>
                            <td>{menu.name}</td>
                            <td>{new Date(menu.closingDateTime).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                            <td className="actions-cell">
                                <Link to={`/administracion/editar-menu/${menu.id}`} className="btn-edit">Modificar</Link>
                                <button onClick={() => handleDelete(menu.id)} className="btn-delete">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="4">No hay menús para mostrar.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MenuList;