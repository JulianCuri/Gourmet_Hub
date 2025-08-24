import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import ItemCard from '../ItemCard/ItemCard';
import './MenuReservation.css';

const MenuReservation = ({ menus, items }) => {
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
                <h1>{menu.name}</h1>
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
