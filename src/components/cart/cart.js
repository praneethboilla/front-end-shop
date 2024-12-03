import React, { useState } from 'react';
import './cart.css';
import { useLocation } from 'react-router-dom';

const Cart = () => {
  const location = useLocation();
  const data = location.state;
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  const handleIncrease = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
      setError('');
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setError('');
    }
  };

  const handleChange = (event) => {
    let newQuantity = Number(event.target.value);
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
      setError('');
    } else {
      setError(`Quantity must be between ${1} and ${10}`);
    }
  };

  const handlePlaceOrder = () => {
    alert("hello");
  };

  if (!data) {
    return (
      <div className="cart-container">
        <h2>Your cart is empty</h2>
      </div>
    );
  }

  return (
    <div>
      <h2 className="cart-name">Cart</h2>
    <div className="cart-container">
      <div className="cart-item">
        <img 
          alt='' 
          src={data.product.productImage}
          className="cart-item-image"
        />
        <div className="cart-item-details">
          <h2 className="cart-item-name">{data.product.name}</h2>
          <h3 className="cart-item-price">${data.product.price * quantity}</h3>
        </div>
      </div>
      
      <div className="quantity-selector">
        <button onClick={handleDecrease} className="quantity-button" aria-label="Decrease quantity">-</button>
        <input
          type="number"
          value={quantity}
          onChange={handleChange}
          min={1}
          max={10}
          step={1}
          className="quantity-input"
          aria-label="Set quantity"
        />
        <button onClick={handleIncrease} className="quantity-button" aria-label="Increase quantity">+</button>
      </div>

      {error && <p className="error-message">{error}</p>}
      <div>
      <button onClick={handlePlaceOrder}>Place Order</button>
      </div>
    </div>
    </div>
  );
};

export default Cart;

