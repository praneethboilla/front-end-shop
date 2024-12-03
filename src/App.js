import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import './App.css';
import HomeScreen from './components/home/homescreen';
import Navbar from './components/navbar/navbar';
import ProductPage from './components/product/productPage';
import ProductDisc from './components/productDisc/productDisc';
import AboutPage from './components/about/aboutPage';
import ContactUs from './components/contact/contactUs';
import Orders from './components/orders/orders';
import Cart from './components/cart/cart';

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes> 
        <Route path="/" element={<HomeScreen />} />  
        <Route path="/products" element={<ProductPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/productDisc" element={<ProductDisc />} />  
        <Route path="/orders" element={<Orders />} />
        <Route path="/cart" element={<Cart />} />  
      </Routes>
    </Router>
  );
}

export default App;



//