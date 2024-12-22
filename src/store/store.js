import { configureStore } from "@reduxjs/toolkit";
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        orders: orderReducer,
    },
});