import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './MenuForm.css';

const getFormattedMenuName = (eventType, menuDateInput) => {
    // menuDateInput can be a Date or a string 'YYYY-MM-DD'
    let date;
    if (!menuDateInput) return `Menú ${eventType}`;
    if (menuDateInput instanceof Date) {
        date = menuDateInput;
    } else if (typeof menuDateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(menuDateInput)) {
        const [year, month, day] = menuDateInput.split('-').map(Number);
        date = new Date(year, month - 1, day);
    } else {
        date = new Date(menuDateInput);
    }
    const weekday = date.toLocaleDateString('es-ES', { weekday: 'long' });
    const datePart = date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    const capitalizedDayOfWeek = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    return `Menú ${eventType.charAt(0).toUpperCase() + eventType.slice(1)} ${capitalizedDayOfWeek} ${datePart}`;
};

const MenuForm = ({ addMenu, items, menus, updateMenu }) => {
    const { id } = useParams(); // Get menu ID from URL for editing
    const [isEditing, setIsEditing] = useState(false);

    const [menuId, setMenuId] = useState(null);
    const [menuDate, setMenuDate] = useState(null);
    const [eventType, setEventType] = useState('almuerzo');
    const [closingDate, setClosingDate] = useState(null);
    const [mainDishes, setMainDishes] = useState([]);
    const [desserts, setDesserts] = useState([]);
    const [drinks, setDrinks] = useState([]);
    
    const [availableMainDishes, setAvailableMainDishes] = useState([]);
    const [availableDesserts, setAvailableDesserts] = useState([]);
    const [availableDrinks, setAvailableDrinks] = useState([]);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const isInitialLoadRef = React.useRef(true);

    // Mark initial load as complete after component mounts
    useEffect(() => {
        isInitialLoadRef.current = false;
    }, []);

    // When menuDate or eventType changes, auto-update closingDate (but not during initial load)
    useEffect(() => {
        if (menuDate && !isInitialLoadRef.current) {
            const newClosingDate = new Date(menuDate);
            const hour = eventType === 'almuerzo' ? 9 : 19; // 9 AM for almuerzo, 7 PM for cena
            newClosingDate.setHours(hour, 0, 0, 0);
            setClosingDate(newClosingDate);
        }
    }, [menuDate, eventType]);
    const editingId = id ? String(id) : null;
    const menuAvailable = editingId ? (menus || []).some(m => String(m.id) === editingId) : true;

    useEffect(() => {
        // Filter categories case-insensitively and allow partial matches so backend/other components
        // can use different casing (e.g. 'plato principal' or 'Plato Principal') and still appear here.
        const byCategory = (catToken) => (i) => {
            const c = (i && i.category) ? String(i.category).toLowerCase() : '';
            return c.includes(catToken);
        };

        setAvailableMainDishes((items || []).filter(byCategory('plato')));
        setAvailableDesserts((items || []).filter(byCategory('postre')));
        setAvailableDrinks((items || []).filter(byCategory('bebida')));

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
                // parsedDate expected as 'YYYY-MM-DD' -> convert to local Date to avoid UTC parse offset
                if (parsedDate && typeof parsedDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(parsedDate)) {
                    const [y, m, d] = parsedDate.split('-').map(Number);
                    setMenuDate(new Date(y, m - 1, d));
                } else if (parsedDate) {
                    const parsed = new Date(parsedDate);
                    setMenuDate(!isNaN(parsed.getTime()) ? parsed : null);
                } else {
                    setMenuDate(null);
                }
                setEventType(parsedEventType || 'almuerzo');

                // closingDateTime in backend may be just a date or a full datetime. Convert to Date object for DatePicker.
                let rawClosing = menuToEdit.closingDateTime || menuToEdit.closingDate || '';
                let closingDateObj = null;
                if (rawClosing) {
                    if (rawClosing.includes('T')) {
                        closingDateObj = new Date(rawClosing);
                    } else if (/^\d{4}-\d{2}-\d{2}$/.test(rawClosing)) {
                        closingDateObj = new Date(`${rawClosing}T00:00`);
                    } else {
                        closingDateObj = new Date(rawClosing);
                    }
                    if (isNaN(closingDateObj.getTime())) closingDateObj = null;
                }
                setClosingDate(closingDateObj);

                // Ensure arrays of numeric ids
                setMainDishes(Array.isArray(menuToEdit.mainDishes) ? menuToEdit.mainDishes.map(Number) : []);
                setDesserts(Array.isArray(menuToEdit.desserts) ? menuToEdit.desserts.map(Number) : []);
                setDrinks(Array.isArray(menuToEdit.drinks) ? menuToEdit.drinks.map(Number) : []);
            } else {
                // no menu found yet — clear fields so they don't show stale values
                setMenuId(null);
                setMenuDate(null);
                setEventType('almuerzo');
                setClosingDate(null);
                setMainDishes([]);
                setDesserts([]);
                setDrinks([]);
            }
            // Mark initial load as complete, so auto-update of closingDate will trigger on future changes
            isInitialLoadRef.current = false;
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

        // Client-side validations -> collect into errors to display inline
        const newErrors = {};
        if (!menuDate) newErrors.menuDate = 'Seleccione una fecha para el menú.';
        if (!closingDate) newErrors.closingDate = 'Seleccione una fecha y hora de cierre.';
        if (menuDate) {
            // normalize to local date start for comparison
            const selected = new Date(menuDate.getFullYear(), menuDate.getMonth(), menuDate.getDate());
            const today = new Date();
            const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            if (selected < todayZero) newErrors.menuDate = 'La fecha del menú no puede ser anterior a la fecha actual.';
            const day = selected.getDay();
            const isWeekend = (day === 0 || day === 6);
            if (isWeekend) newErrors.menuDate = 'No se permiten menús en fin de semana.';
        }
        if (mainDishes.length < 3 || mainDishes.length > 4) newErrors.mainDishes = 'Seleccione entre 3 y 4 platos principales.';
        if (desserts.length < 3 || desserts.length > 4) newErrors.desserts = 'Seleccione entre 3 y 4 postres.';
        if (drinks.length < 3 || drinks.length > 6) newErrors.drinks = 'Seleccione entre 3 y 6 bebidas.';
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const menuData = {
            name: getFormattedMenuName(eventType, menuDate),
            // send date as YYYY-MM-DD string to backend
            date: menuDate ? `${menuDate.getFullYear()}-${String(menuDate.getMonth() + 1).padStart(2, '0')}-${String(menuDate.getDate()).padStart(2, '0')}` : null,
            eventType,
            closingDateTime: closingDate ? closingDate.toISOString().substring(0, 16) : null,
            mainDishes,
            desserts,
            drinks,
            images: [], // Placeholder for images
        };

        (async () => {
            setErrors({});
            try {
                if (isEditing) {
                    await updateMenu({ ...menuData, id: menuId });
                } else {
                    await addMenu(menuData);
                }
                navigate('/administracion');
            } catch (err) {
                if (err && err.type === 'validation' && err.fields) {
                    setErrors(err.fields);
                } else {
                    // fallback: show console and keep form visible
                    console.error('Error guardando menú:', err);
                    setErrors({ general: 'Error al guardar el menú. Intente de nuevo.' });
                }
            }
        })();
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
                    <DatePicker
                        id="menuDate"
                        selected={menuDate}
                        onChange={(date) => {
                            if (date) {
                                const day = date.getDay();
                                const isWeekend = (day === 0 || day === 6);
                                if (isWeekend) {
                                    setMenuDate(null);
                                    setErrors(prev => ({ ...prev, menuDate: 'No se permiten menús en fin de semana.' }));
                                    return;
                                }
                                setMenuDate(date);
                                setErrors(prev => { const copy = { ...prev }; delete copy.menuDate; return copy; });
                            } else {
                                setMenuDate(null);
                            }
                        }}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Seleccione fecha"
                        minDate={new Date()}
                        filterDate={(date) => {
                            const day = date.getDay();
                            return day !== 0 && day !== 6; // disable Sundays(0) and Saturdays(6)
                        }}
                        className="react-datepicker-input"
                    />
                    {errors.menuDate && <div className="field-error">{errors.menuDate}</div>}
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
                    <DatePicker
                        id="closingDate"
                        selected={closingDate}
                        onChange={(date) => {
                            if (date) {
                                const day = date.getDay();
                                const isWeekend = (day === 0 || day === 6);
                                if (isWeekend) {
                                    setClosingDate(null);
                                    setErrors(prev => ({ ...prev, closingDate: 'No se permiten cierres en fin de semana.' }));
                                    return;
                                }
                                setClosingDate(date);
                                setErrors(prev => { const copy = { ...prev }; delete copy.closingDate; return copy; });
                            } else {
                                setClosingDate(null);
                            }
                        }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        dateFormat="dd/MM/yyyy HH:mm"
                        placeholderText="Seleccione fecha y hora"
                        minDate={new Date()}
                        filterDate={(date) => {
                            const day = date.getDay();
                            return day !== 0 && day !== 6; // disable Sundays(0) and Saturdays(6)
                        }}
                        className="react-datepicker-input"
                    />
                    {errors.closingDate && <div className="field-error">{errors.closingDate}</div>}
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
                        {errors.mainDishes && <div className="field-error">{errors.mainDishes}</div>}
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
                        {errors.desserts && <div className="field-error">{errors.desserts}</div>}
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
                        {errors.drinks && <div className="field-error">{errors.drinks}</div>}
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