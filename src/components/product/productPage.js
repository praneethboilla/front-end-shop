import React, { useEffect, useState, useCallback } from 'react';
import './productPage.css';
import { useNavigate } from 'react-router-dom';
import Spinner from '../utility/loader/spinner';

function ProductPage() {
    const navigate = useNavigate();
    const [groupedProducts, setGroupedProducts] = useState({});
    const [filteredProducts, setFilteredProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        fetch('/products')
            .then(result => result.json())
            .then(data => {
                // Group products by category
                const products = data.products.reduce((acc, product) => {
                    if (!acc[product.category]) {
                        acc[product.category] = [];
                    }
                    acc[product.category].push(product);
                    return acc;
                }, {});
                setGroupedProducts(products);
                setFilteredProducts(products); // Initially show all products
            })
            .catch(err => {
                setError('Error fetching products: ' + err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Update filtered products based on selected category
    const filterProductsByCategory = useCallback(() => {
        if (selectedCategory === 'all') {
            setFilteredProducts(groupedProducts);
        } else {
            setFilteredProducts({ [selectedCategory]: groupedProducts[selectedCategory] });
        }
    }, [selectedCategory, groupedProducts]);

    // Use useEffect to filter products when category changes
    useEffect(() => {
        filterProductsByCategory();
    }, [selectedCategory, filterProductsByCategory]);

    const categories = Object.keys(groupedProducts);

    const productOpen = (product) => {
        navigate('/productDisc', { state: { product } });
    };

    if (loading) {
        return   <Spinner/>// You can enhance the loading experience with a spinner or animation
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className='product-Page'>
            <h1>Categories</h1>
            <div className='category-select'>
                <div
                    className={`category-option ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('all')}
                >
                    All Categories
                </div>
                {categories.map((category) => (
                    <div
                        key={category}
                        className={`category-option ${selectedCategory === category ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </div>
                ))}
            </div>
            {/* Displaying Filtered Products */}
            {Object.keys(filteredProducts).map(category => (
                <div key={category} className='productContainer'>
                    <h2 className='subHeading'>{category}</h2>
                    <div className="product-list">
                        {filteredProducts[category].map(product => (
                            <div key={product._id} className="product-item"
                                onClick={() => productOpen(product)}
                            >
                                <img
                                    src={product.productImage}
                                    alt={product.name}
                                />
                                <div className='product-disc'>
                                    <h3>{product.name}</h3>
                                    <p>Price: ${product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ProductPage;
//
