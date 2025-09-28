import React, { useState } from 'react';

import './Main.css';
import MenuCard from '../MenuCard/MenuCard';

const getWeekRange = (weekStart = 0) => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // Sunday is 0, Monday is 1, etc.

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - dayOfWeek + (7 * weekStart));
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
};

const daysOfWeek = [
  { id: 'lunes', label: 'Lunes', dayIndex: 0 },
  { id: 'martes', label: 'Martes', dayIndex: 1 },
  { id: 'miercoles', label: 'Miércoles', dayIndex: 2 },
  { id: 'jueves', label: 'Jueves', dayIndex: 3 },
  { id: 'viernes', label: 'Viernes', dayIndex: 4 },
];

function Main({ menus, items }) {
  const [eventType, setEventType] = useState('todos');
  const [weekRange, setWeekRange] = useState('all');
  const [selectedDays, setSelectedDays] = useState([]);

  const handleEventTypeChange = (e) => {
    setEventType(e.target.value);
  };

  const handleWeekRangeChange = (e) => {
    setWeekRange(e.target.value);
  };

  const handleDayChange = (dayIndex) => {
    setSelectedDays(prev =>
      prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex]
    );
  };

  const safeMenus = Array.isArray(menus) ? menus : [];
  const sortedMenus = [...safeMenus].sort((a, b) => new Date(a.date) - new Date(b.date));

  const filteredMenus = sortedMenus.filter(menu => {
    if (!menu || !menu.date || !menu.eventType) {
      return false;
    }
    const [year, month, day] = menu.date.split('-').map(Number);
    const menuDate = new Date(year, month - 1, day, 12); // Set to noon local time
    const menuDay = (menuDate.getDay() + 6) % 7; // Adjust to make Monday 0, Tuesday 1, ..., Sunday 6

    const eventTypeFilter = eventType === 'todos' || menu.eventType.toLowerCase() === eventType.toLowerCase();

    const dayFilter = selectedDays.length === 0 || selectedDays.includes(menuDay);

    if (weekRange === 'all') {
      return eventTypeFilter && dayFilter;
    }

    let range;
    if (weekRange === 'this-week') {
      range = getWeekRange(0);
    } else if (weekRange === 'next-week') {
      range = getWeekRange(1);
    } else if (weekRange === 'following-week') {
      range = getWeekRange(2);
    }

    const weekFilter = menuDate >= range.startDate && menuDate <= range.endDate;

    return eventTypeFilter && weekFilter && dayFilter;
  });

  return (
    <main className="app-main">
      <div className="main-sections-container">
        <div className="main-section search-section">
          <h2>Buscador</h2>
          <form className="search-form">
            <div className="form-group">
              <label htmlFor="event-type">Tipo de evento:</label>
              <select id="event-type" value={eventType} onChange={handleEventTypeChange}>
                <option value="todos">Todos</option>
                <option value="almuerzo">Almuerzo</option>
                <option value="cena">Cena</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="week-range">Semana:</label>
              <select id="week-range" value={weekRange} onChange={handleWeekRangeChange}>
                <option value="all">Todas</option>
                <option value="this-week">Esta semana</option>
                <option value="next-week">Próxima semana</option>
                <option value="following-week">Semana siguiente</option>
              </select>
            </div>
          </form>
        </div>
        <div className="main-section categories-section">
          <h2>¿Para qué días vas a reservar?</h2>
          <div className="day-selector">
            {daysOfWeek.map(day => (
              <button
                key={day.id}
                className={`day-button ${selectedDays.includes(day.dayIndex) ? 'selected' : ''}`}
                onClick={() => handleDayChange(day.dayIndex)}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="main-section menu-list-section">
        <h2>Próximos menús</h2>
        <div className="menu-list">
          {filteredMenus.map(menu => (
            <MenuCard key={menu.id} menu={menu} items={items} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Main;