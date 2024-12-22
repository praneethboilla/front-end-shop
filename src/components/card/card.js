import { useEffect, useState } from 'react';
import './card.css';
import { useNavigate } from 'react-router-dom';
import Spinner from '../utility/loader/spinner';

function Card() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const productClick = (product) => {
    navigate('/productDisc', { state: { product } })
  }

  const getProducts = () => {
    fetch("/products/random")
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        return res.json();
      })
      .then(json => setProducts(json.products.slice(5, 15)))
      .catch(err => {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      });
  };

  const addToCart = (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication failed: Token is missing');
      return;
    }
    fetch('/cart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ productId , quantity : 1 })
    })
    .then(res => res.json())
    .then(() => {
      navigate('/cart');
    })
    .catch(err => setError(err,'Error in adding product to cart'));
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className='card-header'>
      <h1>Popular Stickers</h1>
      {error && <p className="error-message">{error}</p>}
      {products.length === 0 && !error ? (
        <Spinner/>
      ) : (
        <ul>
          {products.map(product => (
            <li key={product._id} className="product-items">
              {product.productImage && (
                <img
                  src={product.productImage}
                  alt={product.name}
                  className="product-image"
                  onClick={() => productClick(product)}
                />
              )}
              <div className="product-footer">
                <h2>{product.name}</h2>
                <p className="product-price">${product.price}</p>
                <button onClick={() => addToCart(product._id)}>Add to cart</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Card;
//

