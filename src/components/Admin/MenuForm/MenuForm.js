
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MenuForm.css';

const MenuForm = ({ addMenu, items }) => {
    const [menuDate, setMenuDate] = useState('');
    const [eventType, setEventType] = useState('almuerzo');
    const [closingDate, setClosingDate] = useState('');
    const [mainCourses, setMainCourses] = useState([]);
    const [desserts, setDesserts] = useState([]);
    const [drinks, setDrinks] = useState([]);
    
    const [availableMainCourses, setAvailableMainCourses] = useState([]);
    const [availableDesserts, setAvailableDesserts] = useState([]);
    const [availableDrinks, setAvailableDrinks] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        setAvailableMainCourses(items.filter(i => i.category === 'plato principal'));
        setAvailableDesserts(items.filter(i => i.category === 'postre'));
        setAvailableDrinks(items.filter(i => i.category === 'bebida'));
    }, [items]);

    const handleCheckboxChange = (e, setter, selectedItems) => {
        const { value, checked } = e.target;
        if (checked) {
            setter([...selectedItems, value]);
        } else {
            setter(selectedItems.filter(item => item !== value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!menuDate || !closingDate) {
            alert('Por favor, complete todos los campos de fecha.');
            return;
        }
        if (new Date(menuDate) < new Date(new Date().toDateString())) {
            alert('La fecha del menú no puede ser anterior a la fecha actual.');
            return;
        }
        if (mainCourses.length < 3 || mainCourses.length > 4) {
            alert('Debe seleccionar entre 3 y 4 platos principales.');
            return;
        }
        if (desserts.length < 3 || desserts.length > 4) {
            alert('Debe seleccionar entre 3 y 4 postres.');
            return;
        }
        if (drinks.length < 3 || drinks.length > 6) {
            alert('Debe seleccionar entre 3 y 6 bebidas.');
            return;
        }

        const newMenu = {
            name: `Menú ${eventType} ${menuDate}`,
            menuDate,
            eventType,
            closingDate,
            mainCourses,
            desserts,
            drinks,
            images: [], // Placeholder for images
        };

        addMenu(newMenu);
        alert('Menú guardado con éxito.');
        navigate('/administracion');
    };

    return (
        <div className="menu-form-container">
            <div className="form-header">
                <h1>Agregar Nuevo Menú</h1>
                <Link to="/administracion" className="btn-back">Volver a la lista</Link>
            </div>
            <form className="menu-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="menuDate">Fecha del Menú</label>
                    <input
                        type="date"
                        id="menuDate"
                        name="menuDate"
                        required
                        value={menuDate}
                        onChange={(e) => setMenuDate(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="eventType">Tipo de Evento</label>
                    <select id="eventType" name="eventType" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                        <option value="almuerzo">Almuerzo</option>
                        <option value="cena">Cena</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="closingDate">Fecha y Hora de Cierre</label>
                    <input
                        type="datetime-local"
                        id="closingDate"
                        name="closingDate"
                        required
                        value={closingDate}
                        onChange={(e) => setClosingDate(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label>Platos Principales (seleccione 3 a 4)</label>
                    <div className="checkbox-group">
                        {availableMainCourses.map(item => (
                            <div key={item.id}>
                                <input
                                    type="checkbox"
                                    id={`main-${item.id}`}
                                    value={item.id}
                                    onChange={(e) => handleCheckboxChange(e, setMainCourses, mainCourses)}
                                />
                                <label htmlFor={`main-${item.id}`}>{item.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Postres (seleccione 3 a 4)</label>
                    <div className="checkbox-group">
                        {availableDesserts.map(item => (
                            <div key={item.id}>
                                <input
                                    type="checkbox"
                                    id={`dessert-${item.id}`}
                                    value={item.id}
                                    onChange={(e) => handleCheckboxChange(e, setDesserts, desserts)}
                                />
                                <label htmlFor={`dessert-${item.id}`}>{item.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Bebidas (seleccione 3 a 6)</label>
                    <div className="checkbox-group">
                        {availableDrinks.map(item => (
                            <div key={item.id}>
                                <input
                                    type="checkbox"
                                    id={`drink-${item.id}`}
                                    value={item.id}
                                    onChange={(e) => handleCheckboxChange(e, setDrinks, drinks)}
                                />
                                <label htmlFor={`drink-${item.id}`}>{item.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-submit">Guardar Menú</button>
                </div>
            </form>
        </div>
    );
};

export default MenuForm;
