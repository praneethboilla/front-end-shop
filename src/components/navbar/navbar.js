import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';  
import './navbar.css';
import logo from "../../resources/cropLogo.png"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {/* <h2>Grab Stickers</h2> */}
         <img src={logo} alt='logo' width={275} height={50}/>
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
        <li>
          <NavLink to="/cart">
            <i className="fa fa-shopping-cart" style={{ fontSize: '24px', color: 'white' }} />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
//

