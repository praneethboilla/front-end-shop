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

  const handleCart = (product) => {
    navigate('/cart', { state: { product } })
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
          <button className="addToCartBtn" onClick={() => handleCart(data.product)}>Add to Cart</button>
          <button className="buyNowBtn">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDisc;
//