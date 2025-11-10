import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ItemForm.css';

const ItemForm = ({ addItem }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('plato principal');
    const [imageUrl, setImageUrl] = useState('');
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
            // Save the provided URL into both fields so older code and UI can read it
            image: imageUrl || '',
            imageUrl: imageUrl || ''
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
                    <label htmlFor="imageUrl">URL de la imagen</label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        placeholder="Ej: /images/principal1.jpg o https://..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                    <small className="hint">También puedes dejarla vacía y luego editar la imagen manualmente.</small>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-submit">Guardar Item</button>
                </div>
            </form>
        </div>
    );
};

export default ItemForm;
