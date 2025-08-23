
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './MenuForm.css';

const getFormattedMenuName = (eventType, menuDateString) => {
    const date = new Date(menuDateString);
    const options = { weekday: 'long', day: '2-digit', month: '2-digit' };
    const formattedDate = date.toLocaleDateString('es-ES', options); // e.g., "lunes 01/09"
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
    const [mainCourses, setMainCourses] = useState([]);
    const [desserts, setDesserts] = useState([]);
    const [drinks, setDrinks] = useState([]);
    
    const [availableMainCourses, setAvailableMainCourses] = useState([]);
    const [availableDesserts, setAvailableDesserts] = useState([]);
    const [availableDrinks, setAvailableDrinks] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        setAvailableMainCourses(items.filter(i => i.category === 'Plato Principal'));
        setAvailableDesserts(items.filter(i => i.category === 'Postre'));
        setAvailableDrinks(items.filter(i => i.category === 'Bebida'));

        if (id) {
            setIsEditing(true);
            const menuToEdit = menus.find(menu => menu.id === parseInt(id));
            if (menuToEdit) {
                setMenuId(menuToEdit.id);
                setMenuDate(menuToEdit.date);
                setEventType(menuToEdit.eventType);
                setClosingDate(menuToEdit.closingDateTime);
                setMainCourses(menuToEdit.mainDishes);
                setDesserts(menuToEdit.desserts);
                setDrinks(menuToEdit.drinks);
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

        const menuData = {
            name: getFormattedMenuName(eventType, menuDate),
            menuDate,
            eventType,
            closingDate,
            mainCourses,
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
            <div className="form-header">
                <h1>{isEditing ? 'Editar Menú' : 'Agregar Nuevo Menú'}</h1>
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
                                    checked={mainCourses.includes(item.id)}
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
