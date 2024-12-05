import React, { useEffect, useState } from 'react';
import './cart.css';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch("/cart")
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        return res.json();
      })
      .then(json => {
        console.log('Cart data:', json);  // Log the response to verify data
        if (json.length > 0) {
          setCart(json[0].products || []);  // Access the first cart's products
        } else {
          setCart([]);  // If no cart data, set to an empty array
        }
      })
      .catch(err => setError('Error fetching cart'));
  }, []);

  // Handle quantity change for a specific product
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 10) {
      setError('Quantity must be between 1 and 10');
      return;
    }
    setError('');

    // Update the quantity in the cart state
    setCart(prevCart => {
      return prevCart.map(item =>
        item.product._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });

    // Call the PATCH API to update the quantity in the backend
    fetch(`/cart/${productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity })
    })
      .then(res => res.json())
      .catch(err => setError(err, 'Error updating quantity'));
  };

  const handleIncrease = (productId, quantity) => {
    if (quantity < 10) {
      handleQuantityChange(productId, quantity + 1);
    }
  };

  const handleDecrease = (productId, quantity) => {
    if (quantity > 1) {
      handleQuantityChange(productId, quantity - 1);
    }
  };

  const handlePlaceOrder = () => {
    alert("Order placed successfully! (This is a placeholder action)");
  };

  const handleDelete = (productId) => {
    fetch(`/cart/${productId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => {
        if (response.ok) {
          setCart(prevCart => prevCart.filter(item => item.product._id !== productId));
        } else {
          console.error('Failed to delete product');
        }
      })
      .catch(error => {
        console.error('Error occurred during delete:', error);
      });
  }

  return (
    <div>
      <h2 className="cart-name">Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map(item => (
          <div key={item.product._id} className="cart-container">
            <div className="cart-item">
              <img
                alt={item.product.name}
                src={item.product.productImage}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h2 className="cart-item-name">{item.product.name}</h2>
                <h3 className="cart-item-price">${item.product.price * item.quantity}</h3>
              </div>
            </div>

            <div className="quantity-selector">
              <button onClick={() => handleDecrease(item.product._id, item.quantity)}
                className="quantity-button"
                aria-label="Decrease quantity">-</button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.product._id, Number(e.target.value))}
                min={1}
                max={10}
                step={1}
                className="quantity-input"
                aria-label="Set quantity"
              />
              <button onClick={() => handleIncrease(item.product._id, item.quantity)}
                className="quantity-button"
                aria-label="Increase quantity">+</button>
            </div>
            <button onClick={() => handleDelete(item.product._id)}>Delete</button>
            {error && <p className="error-message">{error}</p>}
          </div>
        ))
      )}
      {cart.length > 0 && (
        <div>
          <button onClick={handlePlaceOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
//

