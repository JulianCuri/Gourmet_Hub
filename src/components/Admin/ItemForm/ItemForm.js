import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ItemForm.css';

const ItemForm = ({ addItem }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('plato principal');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !category) {
            alert('Por favor, complete todos los campos requeridos.');
            return;
        }
        const newItem = {
            name,
            category,
            image: '', // Image handling not implemented
        };
        const success = addItem(newItem);
        if (success) {
            alert('Item guardado con éxito.');
            navigate('/administracion/items'); // Redirect after saving
        }
    };

    return (
        <div className="item-form-container">
            <div className="form-header">
                <h1>Agregar Nuevo Item</h1>
                <Link to="/administracion/items" className="btn-back">Volver a la lista</Link>
            </div>
            <form className="item-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Nombre del Item</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="Ej: Milanesa con puré"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Categoría</label>
                    <select
                        id="category"
                        name="category"
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="plato principal">Plato Principal</option>
                        <option value="postre">Postre</option>
                        <option value="bebida">Bebida</option>
                    </select>
                </div>
                {/* Campo de descripción eliminado */}
                <div className="form-group">
                    <label htmlFor="image">Imagen</label>
                    <input type="file" id="image" name="image" accept="image/*" />
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-submit">Guardar Item</button>
                </div>
            </form>
        </div>
    );
};

export default ItemForm;
