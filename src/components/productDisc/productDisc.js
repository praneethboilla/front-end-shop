import React, { useState } from 'react';
import './productDisc.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ProductDisc = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const addToCart = (productId) => {
    fetch('/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: productId, quantity : 1 })
    })
    .then(res => res.json())
    .then(navigate('/cart'))
    .catch(err => {
      console.error("Error in adding product to cart", err);
    });
  }

  return (
    <div className='container'>
      <img
        src={data.product.productImage}
        className="productDics-image"
        alt={data.product.name}
      />
      <div className='DiscContainer'>
        <h2>{data.product.name}</h2>
        <h4>{`$${data.product.price}`}</h4>
        <p className={`description ${isExpanded ? 'expanded' : ''}`}>
          {data.product.description}
        </p>
        <p onClick={toggleDescription} className="toggleDescriptionBtn">
          {isExpanded ? 'Show Less' : 'Show More'}
        </p>
        <div className="buttons-container">
          <button className="addToCartBtn" onClick={() => addToCart(data.product._id)}>Add to Cart</button>
          <button className="buyNowBtn">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDisc;
//