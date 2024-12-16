import React, { useState } from 'react';
import './productDisc.css';
import { useLocation, useNavigate } from 'react-router-dom';

const ProductDisc = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!data || !data.product) {
    return <div>Product not found</div>;
  }

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const addToCart = (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication failed: Token is missing or login');
      return;
    }
    setIsLoading(true); // Show loading spinner
    fetch('/cart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity: 1 }),
    })
    .then((res) => res.json())
    .then(() => {
      setIsLoading(false);
      navigate('/cart');
    })
    .catch((err) => {
      setIsLoading(false);
      console.error('Error in adding product to cart', err);
    });
  };

  return (
    <div className="container">
      <img
        src={data.product.productImage}
        className="productDics-image"
        alt={data.product.name || 'Product image'}
      />
      <div className="DiscContainer">
        <h2>{data.product.name}</h2>
        <h4>{`$${data.product.price}`}</h4>
        <p className={`description ${isExpanded ? 'expanded' : ''}`}>
          {data.product.description}
        </p>
        <p onClick={toggleDescription} className="toggleDescriptionBtn">
          {isExpanded ? 'Show Less' : 'Show More'}
        </p>
        <div className="buttons-container">
          <button 
            className="addToCartBtn" 
            onClick={() => addToCart(data.product._id)} 
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add to Cart'}
          </button>
          <button 
            className="buyNowBtn" 
            onClick={() => alert('Buy Now functionality coming soon')}
          >
            Buy Now
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default ProductDisc;

//