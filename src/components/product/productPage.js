import React, { useEffect, useState } from 'react';
import './productPage.css';
import { useNavigate } from 'react-router-dom';

function ProductPage() {
    const navigate = useNavigate();
    const [groupedProducts, setGroupedProducts] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        fetch('/products')
            .then(result => result.json())
            .then(data => {
                const products = data.products.reduce((acc, product) => {
                    if (!acc[product.category]) {
                        acc[product.category] = [];
                    }
                    acc[product.category].push(product);
                    return acc;
                }, {});
                setGroupedProducts(products);
            })
            .catch(err => {
                setError('Error fetching products: ' + err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Filter products based on selected category
    const filterProducts = () => {
        if (selectedCategory === 'all') {
            return groupedProducts; 
        }
        return { [selectedCategory]: groupedProducts[selectedCategory] }; // Show only selected category
    };

    const categories = Object.keys(groupedProducts);

    const productOpen = (product) => {
        navigate('/productDisc', { state: { product } })
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
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
            {Object.keys(filterProducts()).map(category => (
                <div key={category} className='productContainer'>
                    <h2 className='subHeading'>{category}</h2>
                    <div className="product-list">
                        {filterProducts()[category].map(product => (
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
