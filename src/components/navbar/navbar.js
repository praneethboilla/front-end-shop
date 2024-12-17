import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './navbar.css';
import logo from "../../resources/cropLogo.png"
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // If token exists, user is logged in
    } else {
      setIsLoggedIn(false); // If no token, user is logged out
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logOut = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setIsLoggedIn(false); // Update the state to reflect the logged-out status
    navigate("/login"); // Redirect to the login page
  };

  const logIn = () => {
    navigate("/login"); // Redirect to the login page if the user is not logged in
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {/* <h2>Grab Stickers</h2> */}
        <img src={logo} alt='logo' width={275} height={50} />
      </div>
      <div className={`navbar-toggle ${isMenuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      <ul className={`navbar-links ${isMenuOpen ? 'show' : ''}`}>
        <li>
          <NavLink
            to="/home"
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/products"
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            Products
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/orders"
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            Orders
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) => isActive ? 'active-link' : ''}
          >
            Contact
          </NavLink>
        </li>
        {/* <li>
          <NavLink to="/cart">
            <i className="fa fa-shopping-cart" style={{ fontSize: '24px', color: 'white' }} />
          </NavLink>
        </li> */}
        <li>
          <NavLink to="/cart" className={({ isActive }) => isActive ? 'active-link' : ''}>
            Cart
          </NavLink>
        </li>
        {/* Conditional rendering: show LogOut if logged in, else show LogIn */}
        {isLoggedIn ? (
          <li onClick={logOut} className='logout'>
            Logout
          </li>
        ) : (
          <li onClick={logIn} className='login'>
            LogIn
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
//

