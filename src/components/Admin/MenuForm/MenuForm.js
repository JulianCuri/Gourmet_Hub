import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './MenuForm.css';

const getFormattedMenuName = (eventType, menuDateString) => {
    const [year, month, day] = menuDateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const options = { weekday: 'long', day: '2-digit', month: '2-digit', timeZone: 'UTC' };
    const formattedDate = date.toLocaleDateString('es-ES', options);
    const [dayOfWeek, datePart] = formattedDate.split(' ');
    const capitalizedDayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
    return `Menú ${eventType.charAt(0).toUpperCase() + eventType.slice(1)} ${capitalizedDayOfWeek} ${datePart}`;
};

const MenuForm = ({ addMenu, items, menus, updateMenu }) => {
    const { id } = useParams(); // Get menu ID from URL for editing
    const [isEditing, setIsEditing] = useState(false);

    const [menuId, setMenuId] = useState(null);
    const [menuDate, setMenuDate] = useState('');
    const [eventType, setEventType] = useState('almuerzo');
    const [closingDate, setClosingDate] = useState('');
    const [mainDishes, setMainDishes] = useState([]);
    const [desserts, setDesserts] = useState([]);
    const [drinks, setDrinks] = useState([]);
    
    const [availableMainDishes, setAvailableMainDishes] = useState([]);
    const [availableDesserts, setAvailableDesserts] = useState([]);
    const [availableDrinks, setAvailableDrinks] = useState([]);

    const navigate = useNavigate();

    // If we're editing but the menu list hasn't been loaded yet, show a brief loading state
    const editingId = id ? String(id) : null;
    const menuAvailable = editingId ? (menus || []).some(m => String(m.id) === editingId) : true;

    useEffect(() => {
        setAvailableMainDishes((items || []).filter(i => i.category === 'Plato Principal'));
        setAvailableDesserts((items || []).filter(i => i.category === 'Postre'));
        setAvailableDrinks((items || []).filter(i => i.category === 'Bebida'));

        if (id) {
            setIsEditing(true);
            // Be tolerant: menu id could be number or string; try both
            const menuToEdit = (menus || []).find(menu => menu.id === parseInt(id) || String(menu.id) === id);
            console.debug('MenuForm: attempting to load menu for edit', { id, found: !!menuToEdit, menusCount: (menus || []).length });
            if (menuToEdit) {
                setMenuId(menuToEdit.id);
                // Prefer explicit fields, but fall back to parsing description if missing
                // description examples: "Cena 2025-10-13" or "almuerzo 2025-11-15 2025-11-15T17:55"
                const description = menuToEdit.description || '';
                let parsedDate = menuToEdit.date || undefined;
                let parsedEventType = menuToEdit.eventType || undefined;
                if (!parsedDate || !parsedEventType) {
                    const parts = (description || '').split(/\s+/).filter(Boolean);
                    if (!parsedEventType && parts.length >= 1) parsedEventType = parts[0];
                    if (!parsedDate) {
                        const dateToken = parts.find(p => /\d{4}-\d{2}-\d{2}/.test(p));
                        if (dateToken) parsedDate = dateToken;
                    }
                }
                setMenuDate(parsedDate || '');
                setEventType(parsedEventType || 'almuerzo');

                // closingDateTime in backend may be just a date or a full datetime. Convert to 'YYYY-MM-DDTHH:MM' for datetime-local input.
                let rawClosing = menuToEdit.closingDateTime || menuToEdit.closingDate || '';
                let closingForInput = '';
                if (rawClosing) {
                    if (rawClosing.includes('T')) {
                        // keep up to minutes
                        closingForInput = rawClosing.substring(0, 16);
                    } else if (/^\d{4}-\d{2}-\d{2}$/.test(rawClosing)) {
                        closingForInput = `${rawClosing}T00:00`;
                    } else {
                        // try to parse and format
                        const d = new Date(rawClosing);
                        if (!isNaN(d.getTime())) {
                            const yyyy = d.getFullYear();
                            const mm = String(d.getMonth() + 1).padStart(2, '0');
                            const dd = String(d.getDate()).padStart(2, '0');
                            const hh = String(d.getHours()).padStart(2, '0');
                            const min = String(d.getMinutes()).padStart(2, '0');
                            closingForInput = `${yyyy}-${mm}-${dd}T${hh}:${min}`;
                        }
                    }
                }
                setClosingDate(closingForInput);

                // Ensure arrays of numeric ids
                setMainDishes(Array.isArray(menuToEdit.mainDishes) ? menuToEdit.mainDishes.map(Number) : []);
                setDesserts(Array.isArray(menuToEdit.desserts) ? menuToEdit.desserts.map(Number) : []);
                setDrinks(Array.isArray(menuToEdit.drinks) ? menuToEdit.drinks.map(Number) : []);
            } else {
                // no menu found yet — clear fields so they don't show stale values
                setMenuId(null);
                setMenuDate('');
                setEventType('almuerzo');
                setClosingDate('');
                setMainDishes([]);
                setDesserts([]);
                setDrinks([]);
            }
        }
    }, [id, items, menus]);

    const handleCheckboxChange = (e, setter, selectedItems) => {
        const { value, checked } = e.target;
        if (checked) {
            setter([...selectedItems, parseInt(value)]);
        } else {
            setter(selectedItems.filter(item => item !== parseInt(value)));
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
        if (mainDishes.length < 3 || mainDishes.length > 4) {
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

        const menuData = {
            name: getFormattedMenuName(eventType, menuDate),
            date: menuDate,
            eventType,
            closingDateTime: closingDate,
            mainDishes,
            desserts,
            drinks,
            images: [], // Placeholder for images
        };

        if (isEditing) {
            updateMenu({ ...menuData, id: menuId });
            alert('Menú actualizado con éxito.');
        } else {
            addMenu(menuData);
            alert('Menú guardado con éxito.');
        }
        navigate('/administracion');
    };

    return (
        <div className="menu-form-container">
            {isEditing && !menuAvailable ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}>Cargando menú…</div>
            ) : (
            <div className="form-header">
                <h1>{isEditing ? 'Editar Menú' : 'Agregar Nuevo Menú'}</h1>
                <Link to="/administracion" className="btn-back">Volver a la lista</Link>
            </div>
            )}
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
                        {availableMainDishes.map(item => (
                            <div key={item.id}>
                                <input
                                    type="checkbox"
                                    id={`main-${item.id}`}
                                    value={item.id}
                                    checked={mainDishes.includes(item.id)}
                                    onChange={(e) => handleCheckboxChange(e, setMainDishes, mainDishes)}
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
                                    checked={desserts.includes(item.id)}
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
                                    checked={drinks.includes(item.id)}
                                    onChange={(e) => handleCheckboxChange(e, setDrinks, drinks)}
                                />
                                <label htmlFor={`drink-${item.id}`}>{item.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-submit">{isEditing ? 'Guardar Cambios' : 'Guardar Menú'}</button>
                </div>
            </form>
        </div>
    );
};

export default MenuForm;