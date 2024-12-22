import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetching cart data
export const fetchCart = createAsyncThunk('cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('Authentication failed: Token is missing');
            }
            const response = await fetch('/cart', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }
            const data = await response.json();
            return data.products || []; // Ensure an array is returned
        } catch (err) {
            return rejectWithValue(err.message || 'Error fetching cart');
        }
    });

// Updating cart item quantity
export const updateQuantity = createAsyncThunk('cart/updateQuantity',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('Authentication failed: Token is missing');
            }
            const response = await fetch(`/cart/${productId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity }),
            });
            if (!response.ok) {
                throw new Error('Failed to update quantity');
            }
            const updatedItem = await response.json();
            return updatedItem;
        } catch (err) {
            return rejectWithValue(err.message || 'Error updating quantity');
        }
    });

// Deleting cart item
export const deleteItem = createAsyncThunk('cart/deleteItem', async (productId, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            return rejectWithValue('Authentication failed: Token is missing');
        }
        const response = await fetch(`/cart/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete item');
        }
        return productId; // Return productId to remove it from the state
    } catch (err) {
        return rejectWithValue(err.message || 'Error deleting item');
    }
});

export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return rejectWithValue('Authentication failed: Token is missing');
            }

            const response = await fetch('/cart', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to clear the cart');
            }

            const data = await response.json();
            return data; // Return the response if needed (e.g., confirmation message)
        } catch (err) {
            return rejectWithValue(err.message || 'Error clearing cart');
        }
    }
);

const initialState = {
    cart: [],
    isLoading: false,
    error: null
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cart = action.payload || [];
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.cart = [];
                state.error = action.payload;
            })
            .addCase(updateQuantity.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateQuantity.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedCart = action.payload;
                if (updatedCart && updatedCart.products) {
                    // Map through the cart and update the quantity of the correct product
                    state.cart = state.cart.map(item => {
                        // Find the corresponding product in the cart based on the _id
                        const updatedProduct = updatedCart.products.find(product => product.product.toString() === item.product._id.toString());
                        if (updatedProduct) {
                            // Update the item's quantity with the new one
                            return { ...item, quantity: updatedProduct.quantity };
                        }
                        return item;
                    });
                }
            })
            .addCase(updateQuantity.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteItem.fulfilled, (state, action) => {
                state.isLoading = false;
                // Filter out the deleted item from the cart
                state.cart = state.cart.filter(item => item.product._id !== action.payload);
            })
            .addCase(deleteItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(clearCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.isLoading = false;
                state.cart = []; // Clear cart in Redux state
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default cartSlice.reducer;
