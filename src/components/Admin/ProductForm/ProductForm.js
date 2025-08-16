
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductForm.css';

const ProductForm = ({ addProduct }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [closingDate, setClosingDate] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !closingDate) {
            alert('Por favor, complete todos los campos requeridos.');
            return;
        }
        const newProduct = {
            id: Date.now(),
            name,
            description,
            closingDate,
            // In a real app, handle image uploads properly.
            // For now, we'll use a placeholder or leave it empty.
            images: [], 
        };
        addProduct(newProduct);
        alert('Producto guardado con éxito.');
        navigate('/administracion'); // Redirect after saving
    };

    return (
        <div className="product-form-container">
            <div className="form-header">
                <h1>Agregar Nuevo Producto</h1>
                <Link to="/administracion" className="btn-back">Volver a la lista</Link>
            </div>
            <form className="product-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Nombre del Producto/Servicio</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        placeholder="Ej: Menú del Lunes"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Descripción</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="4"
                        placeholder="Ej: Pollo al horno con patatas, ensalada y bebida."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="closingDate">Fecha y Hora de Cierre</label>
                    <input
                        type="datetime-local"
                        id="closingDate"
                        name="closingDate"
                        required
                        max="9999-12-31T23:59"
                        value={closingDate}
                        onChange={(e) => setClosingDate(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Imágenes</label>
                    <input type="file" id="image" name="image" accept="image/*" multiple />
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-submit">Guardar Producto</button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;
