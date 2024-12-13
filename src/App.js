import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import HomeScreen from './components/home/homescreen';
import ProductPage from './components/product/productPage';
import ProductDisc from './components/productDisc/productDisc';
import AboutPage from './components/about/aboutPage';
import ContactUs from './components/contact/contactUs';
import Orders from './components/orders/orders';
import Cart from './components/cart/cart';
import Login from './components/auth/loginPage';
import Signup from './components/auth/signupPage';
import PrivateRoute from './components/auth/privateRoute';
import Navbar from './components/navbar/navbar'; // Assuming you have this Navbar component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <AppContent isAuthenticated={isAuthenticated} />
    </Router>
  );
}

function AppContent({ isAuthenticated }) {
  const location = useLocation(); // Correctly using useLocation() here

  return (
    <>
      {/* Conditionally render Navbar */}
      {location.pathname !== '/login' && location.pathname !== '/signup' && <Navbar />}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Route: If authenticated, render Home, otherwise redirect to login */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />

        {/* Protected Routes */}
        <Route path="/home" element={<PrivateRoute><HomeScreen /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />

        {/* Public Routes */}
        <Route path="/products" element={<ProductPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/productDisc" element={<ProductDisc />} />
      </Routes>
    </>
  );
}

export default App;


