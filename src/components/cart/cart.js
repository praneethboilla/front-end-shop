import React, { useEffect, useState, useCallback } from 'react';
import './cart.css';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication failed: Token is missing');
      setIsLoading(false);
      return;
  }
    fetch("/cart", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch cart');
        }
        return res.json();
      })
      .then(json => {
        if (json.products && json.products.length > 0) {
          setCart(json.products);
        } else {
          setCart([]);
        }
      })
      .catch(err => {
        setError('Error fetching cart');
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, []);



  // Using useCallback to memoize handleQuantityChange function
  const handleQuantityChange = useCallback((productId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 10) {
      setError('Quantity must be between 1 and 10');
      return;
    }
    setError('');

    // Update the cart UI
    const updatedCart = cart.map(item =>
      item.product._id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication failed: Token is missing');
      setIsLoading(false);
      return;
    }
    fetch(`/cart/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify({ quantity: newQuantity })
    })
      .then(res => res.json())
      .catch(err => {
        setError('Error updating quantity');
        console.error(err);
        setCart(cart); // Revert cart if API fails
      })
      .finally(() => setIsLoading(false));
  }, [cart]);

  const handleIncrease = useCallback((productId, quantity) => {
    if (quantity < 10) {
      handleQuantityChange(productId, quantity + 1);
    }
  }, [handleQuantityChange]);

  const handleDecrease = useCallback((productId, quantity) => {
    if (quantity > 1) {
      handleQuantityChange(productId, quantity - 1);
    }
  }, [handleQuantityChange]);



  const handleDelete = useCallback((productId) => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication failed: Token is missing');
      setIsLoading(false);
      return;
  }
    fetch(`/cart/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    })
      .then(response => {
        if (response.ok) {
          setCart(prevCart => prevCart.filter(item => item.product._id !== productId));
          setError('');
        } else {
          setError('Failed to delete product');
        }
      })
      .catch(error => {
        setError('Error occurred during delete');
        console.error('Error during delete:', error);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Using useCallback to memoize total price calculation
  const calculateTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
  }, [cart]);

  const handlePlaceOrder = () => {
    setIsLoading(true);
    const orderData = {
      products: cart.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      }))
    };

    fetch("/orders", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })
    .then(res => {
      if(!res.ok){
        throw new Error('Failed to place Order')
      }
      return res.json();
    })
    .then(json => {
      setOrderSuccess(true);
      clearCart() 
      setCart([]);
      setError('')
    })
    .catch(err => {
      setError('Error placing order');
      console.error(err);
    })
    .finally(() => setIsLoading(false));
  };

  function clearCart() {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication failed: Token is missing');
      setIsLoading(false);
      return;
  }
    fetch('/cart', {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to clear the cart');
        }
        return response.json(); 
    })
    .catch(error => {
        console.error('Error:', error);  
    });
}

  return (
    <div>
      <h2 className="cart-name">Cart</h2>
      {isLoading && <div>Loading...</div>}

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
                <h2 className="cart-item-category">{item.product.category}</h2>
                <h3 className="cart-item-price">${item.product.price * item.quantity}</h3>
              </div>
            </div>

            <div className="quantity-selector">
              <button
                onClick={() => handleDecrease(item.product._id, item.quantity)}
                className="quantity-button"
                aria-label="Decrease quantity"
              >-</button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const newQuantity = Math.max(1, Math.min(10, Number(e.target.value)));
                  handleQuantityChange(item.product._id, newQuantity);
                }}
                min={1}
                max={10}
                step={1}
                className="quantity-input"
                aria-label="Set quantity"
              />
              <button
                onClick={() => handleIncrease(item.product._id, item.quantity)}
                className="quantity-button"
                aria-label="Increase quantity"
              >+</button>
            </div>
            <button className='deleteButton' onClick={() => handleDelete(item.product._id)}>Delete</button>
            {error && <p className="error-message">{error}</p>}
          </div>
        ))
      )}
      {cart.length > 0 && (
        <div>
          <h3 style={{ padding: "10px" }}>Total Price: ${calculateTotalPrice()}</h3>
          <button className='orderButton' onClick={() =>  handlePlaceOrder()}>Place Order</button>
        </div>
      )}
      {orderSuccess && <p>Your order has been successfully placed!</p>}
    </div>
  );
};

export default Cart;
//

