import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './cart.css';
import Spinner from '../utility/loader/spinner';
import Check from '../utility/splash/check';
import { fetchCart, updateQuantity, deleteItem, clearCart } from '../../store/cartSlice';
import { placeOrder } from '../../store/orderSlice'

const Cart = () => {
  const [ orderSuccess, setOrderSuccess] = useState(false)
  const dispatch = useDispatch();
  const { cart, isLoading, error } = useSelector(state => state.cart);

  useEffect(() => {
      dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = useCallback((productId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 10) {
      return; // Optionally, set an error if needed
    }
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  }, [dispatch]);

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
    dispatch(deleteItem(productId));
  }, [dispatch]);

  const calculateTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
  }, [cart]);

  const handlePlaceOrder = () => {
    const orderData = {
      products: cart.map(item => ({
        productId: item.product._id,
        quantity: item.quantity
      }))
    };

    // Dispatch the placeOrder action
    dispatch(placeOrder(orderData)).then((response) => {
      setOrderSuccess(true);
      dispatch(clearCart()); // Clear the cart after successful order
    }).catch(err => {
      console.error("Order placement failed:", err);
    });
  };

  return (
    <div className='cart_page_container'>
      <h2 className="cart-name">Cart</h2>
      {isLoading &&
        <Spinner />
      }
      {orderSuccess &&
        <Check />
      }
      {cart.length === 0 && !isLoading && !orderSuccess ? (
        <div style={{ paddingTop: "20px" }}>
          <p style={{ fontSize: '19px', justifySelf: 'center' }}>Your cart is empty.</p>
        </div>
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
        <div className='total_place'>
          <h3 style={{ padding: "10px" }}>Total Price: ${calculateTotalPrice()}</h3>
          <button className='orderButton' onClick={() => handlePlaceOrder()}>Place Order</button>
        </div>
      )}
    </div>
  );
};

export default Cart;
//
