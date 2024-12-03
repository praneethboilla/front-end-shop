import React, { useEffect, useState, useCallback } from 'react';
import "./orders.css";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const getOrders = useCallback(() => {
        setLoading(true);
        setError(null);
        fetch('/orders')
            .then(result => result.json())
            .then(data => {
                console.log("data", data)
                setOrders(data.orders);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching orders:", err);
                setError("Failed to load orders. Please try again later.");
                setLoading(false);
            });
    }, []);

    console.log("orders", orders)

    useEffect(() => {
        getOrders();
    }, [getOrders]);

    const calculateOrderTotal = (products) => {
        return products.reduce((total, productItem) => {
            const productTotal = productItem.quantity * productItem.product.price;
            return total + productTotal;
        }, 0).toFixed(2); // Round to 2 decimal places
    };
    return (
        <div className='orders-container'>
            <h1>My Orders</h1>
            {error && <p className="order-error-message">{error}</p>}

            {loading ? (
                <p>Loading Orders...</p>
            ) : orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul className='orders-list'>
                    {orders.map((order) => (
                        <li key={order._id} className="order-container">
                            <h2 className="order-header">Order ID: {order._id}</h2>
                            <div>
                                {order.products.map((productItem, index) => (
                                    <div key={index} className="product-order-details">
                                        <img
                                            src={productItem.product.productImage}
                                            alt={productItem.product.name}
                                        />
                                        <div className="product-details">
                                            <h3>{productItem.product.name}</h3>
                                            <p><strong>Quantity:</strong> {productItem.quantity}</p>
                                            <p><strong>Total Price:</strong> ${productItem.quantity * productItem.product.price}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="order-total">
                                    <h3><strong>Order Total: </strong>${calculateOrderTotal(order.products)}</h3>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Orders;
// 
