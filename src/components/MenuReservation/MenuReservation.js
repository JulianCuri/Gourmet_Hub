import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import ItemCard from '../ItemCard/ItemCard';
import './MenuReservation.css';

const MenuReservation = ({ menus, items }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const menu = menus.find(m => m.id === parseInt(id));

    const [selectedMain, setSelectedMain] = useState(null);
    const [selectedDessert, setSelectedDessert] = useState(null);
    const [selectedDrink, setSelectedDrink] = useState(null);

    if (!menu) {
        return <div>Menu not found</div>;
    }

    const mainDishes = menu.mainDishes.map(dishId => items.find(item => item.id === dishId));
    const desserts = menu.desserts.map(dessertId => items.find(item => item.id === dessertId));
    const drinks = menu.drinks.map(drinkId => items.find(item => item.id === drinkId));

    return (
        <>
            <Header />
            <div className="menu-reservation">
                <div className="title-container">
                    <h1>{menu.name}</h1>
                    <div className="back-arrow" onClick={() => navigate(-1)}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <line x1="27" y1="16" x2="7" y2="16" stroke="#fd7e14" strokeWidth="3.5" strokeLinecap="round"/>
                            <polyline points="13,10 7,16 13,22" fill="none" stroke="#fd7e14" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
                <div className="options-container">
                    <div className="option-category">
                        <h2>Platos Principales</h2>
                        <div className="items-grid">
                            {mainDishes.map(dish => (
                                <ItemCard 
                                    key={dish.id} 
                                    item={dish} 
                                    onSelect={setSelectedMain} 
                                    isSelected={selectedMain === dish.id} 
                                />
                            ))}
                        </div>
                    </div>
                    <div className="option-category">
                        <h2>Postres</h2>
                        <div className="items-grid">
                            {desserts.map(dessert => (
                                <ItemCard 
                                    key={dessert.id} 
                                    item={dessert} 
                                    onSelect={setSelectedDessert} 
                                    isSelected={selectedDessert === dessert.id} 
                                />
                            ))}
                        </div>
                    </div>
                    <div className="option-category">
                        <h2>Bebidas</h2>
                        <div className="items-grid">
                            {drinks.map(drink => (
                                <ItemCard 
                                    key={drink.id} 
                                    item={drink} 
                                    onSelect={setSelectedDrink} 
                                    isSelected={selectedDrink === drink.id} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <button className="reserve-button">Reservar pedido</button>
            </div>
            <Footer />
        </>
    );
};

export default MenuReservation;
