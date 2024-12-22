import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// fetch orders
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return rejectWithValue('Authentication failed: Token is missing');
    }

    try {
        const response = await fetch('/orders', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        return data.orders;
    } catch (error) {
        return rejectWithValue('Failed to load orders. Please try again later.');
    }
});

export const placeOrder = createAsyncThunk('orders/placeOrder', async (orderData, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return rejectWithValue('Authentication failed: Token is missing');
    }

    try {
        const response = await fetch('/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            throw new Error('Failed to place Order');
        }

        const data = await response.json();
        console.log("data",data)
        return data;
    } catch (error) {
        return rejectWithValue(error.message || 'Failed to place order');
    }
});

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.orders = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'An error occurred';
            });
    },
});

export default orderSlice.reducer;
