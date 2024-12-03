import { useEffect, useState } from 'react';
import './card.css';
import { useNavigate } from 'react-router-dom';

function Card() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const productClick = (product) => {
    navigate('/productDisc', { state: { product } })
  }

  const getProducts = () => {
    fetch("/products")
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

  const addToCart = (product) => {
    navigate('/cart', { state: { product } })
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className='card-header'>
      <h1>Popular Stickers</h1>
      {error && <p className="error-message">{error}</p>}
      {products.length === 0 && !error ? (
        <p>Loading products...</p>
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
                <button onClick={() => addToCart(product)}>Add to cart</button>
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

