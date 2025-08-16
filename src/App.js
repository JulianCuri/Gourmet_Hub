
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';
import AdminPage from './pages/Admin/AdminPage';
import { products as initialProducts } from './mock/products'; // Import mock data

// This component wraps the public-facing pages
const PublicLayout = ({ products }) => (
  <>
    <Header />
    <Main products={products} />
    <Footer />
  </>
);

function App() {
  const [products, setProducts] = useState(initialProducts);

  const addProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<PublicLayout products={products} />} />
          <Route 
            path="/administracion/*" 
            element={<AdminPage products={products} addProduct={addProduct} />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
