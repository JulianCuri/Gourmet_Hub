import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './ItemForm.css';

const ItemForm = ({ addItem, updateItem, items }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('plato principal');
    const [price, setPrice] = useState('0.00');
    const [imageUrl, setImageUrl] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (id && items && items.length > 0) {
            const existing = items.find(it => String(it.id) === String(id));
            if (existing) {
                setIsEditing(true);
                setName(existing.name || '');
                setCategory(existing.category || 'plato principal');
                // existing.price might be null for non-admin views; but in admin area it should be present
                setPrice(existing.price != null ? String(existing.price) : '0.00');
                setImageUrl(existing.imageUrl || existing.image || '');
            }
        }
    }, [id, items]);

    const [errors, setErrors] = React.useState({});
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        if (!name || !category) {
            setErrors({ general: 'Por favor, complete todos los campos requeridos.' });
            return;
        }
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            setErrors({ price: 'El precio debe ser mayor que 0' });
            return;
        }
        const payload = {
            name,
            category,
            image: imageUrl || '',
            imageUrl: imageUrl || '',
            price: price ? parseFloat(price) : 0.0
        };

        try {
            if (isEditing && updateItem && id) {
                await updateItem(parseInt(id, 10), payload);
            } else {
                await addItem(payload);
            }
            navigate('/administracion/items'); // Redirect after saving
        } catch (err) {
            if (err && err.type === 'validation' && err.fields) {
                setErrors(err.fields);
            } else {
                setErrors({ general: 'Error al guardar el item. Intente de nuevo.' });
                console.error('Failed to save item', err);
            }
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
                <div className="form-group">
                    <label htmlFor="price">Precio (administración)</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        step="0.01"
                        min="0.01"
                        required
                        value={price}
                        onChange={(e) => {
                            setPrice(e.target.value);
                            setErrors(prev => { const copy = { ...prev }; delete copy.price; return copy; });
                        }}
                    />
                    <small className="hint">Este valor se guarda en la base de datos y sólo es visible en Administración.</small>
                    {errors.price && <div className="field-error">{errors.price}</div>}
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
                {errors.general && <div className="field-error">{errors.general}</div>}
            </form>
        </div>
    );
};

export default ItemForm;
