import React, { useEffect, useState, useCallback, useMemo } from 'react';
import './productPage.css';
import { useNavigate } from 'react-router-dom';
import Spinner from '../utility/loader/spinner';

function ProductPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [productsByCategory, setProductsByCategory] = useState({});
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryProducts, setCategoryProducts] = useState({});

    // Fetch all products on initial load
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch('/products?limit=6');
                const data = await response.json();
                setProductsByCategory(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Memoized categories to avoid re-calculation
    const categories = useMemo(() => Object.keys(productsByCategory), [productsByCategory]);

    // Fetch products for a specific category
    const fetchCategoryProducts = useCallback(async (category) => {
        if (categoryProducts[category]) return;  // Skip if products are already fetched
        setLoading(true);
        try {
            const response = await fetch(`/products?category=${category}`);
            const data = await response.json();
            setCategoryProducts((prevState) => ({ ...prevState, [category]: data }));
        } catch (error) {
            console.error("Error fetching category products:", error);
        } finally {
            setLoading(false);
        }
    }, [categoryProducts]);

    // Handle category selection
    const handleCategorySelect = useCallback((category) => {
        setSelectedCategory(category);
        if (category) {
            fetchCategoryProducts(category); // Fetch products for the selected category
        } else {
            setCategoryProducts({}); // Clear category products when 'All Categories' is selected
        }
    }, [fetchCategoryProducts]);

    const renderProductList = useCallback((products) => (
        <div className='products_horizontal_container'>
            {products.length ? (
                products.map((product) => {
                    const productOpen = () => {
                        navigate('/productDisc', { state: { product } });
                    };
                    return (
                        <div
                            key={product._id}
                            className='category_list'
                            onClick={productOpen}
                        >
                            <img
                                src={product.productImage}
                                alt={`image${product.name}`}
                                className='product_page_image'
                            />
                            <h3 className='product_name'>{product.name}</h3>
                            <p className='product_price'>${product.price}</p>
                        </div>
                    );
                })
            ) : (
                <p>No products available.</p>
            )}
        </div>
    ), [navigate]);

    return (
        <div className='products_page_container'>
            <h1 className='product_heading'>Products</h1>
            {loading && <Spinner />}

            <div className='category-select'>
                <div
                    onClick={() => handleCategorySelect(null)}
                    className={`category-item ${selectedCategory === null ? 'selected' : ''}`}
                >
                    All Categories
                </div>
                {categories.map((category) => (
                    <div
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className={`category-item ${selectedCategory === category ? 'selected' : ''}`}
                    >
                        {category}
                    </div>
                ))}
            </div>

            {/* Display all products if no category is selected */}
            <div className='products_all_container'>
                {!selectedCategory ? (
                    categories.map((category) => (
                        <div key={category} className='product_all_list'>
                            <h2 className='category_heading'>{category}</h2>
                            {renderProductList(productsByCategory[category])}
                        </div>
                    ))
                ) : (
                    // Display products for the selected category
                    <div className='products_category_container'>
                        <h2 className='category_heading'>{selectedCategory}</h2>
                        {renderProductList(categoryProducts[selectedCategory] || [])}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductPage;

//
