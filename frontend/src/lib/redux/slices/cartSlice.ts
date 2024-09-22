import { CartData, CartProductData } from "@/lib/interfaces/Cart";
import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: {} as Record<string, CartData>,
    subTotal: 0,
    totalItems: 0,
  },
  reducers: {
    setCartItems: (state, action) => {
      const items = action.payload as CartData[];
      state.cartItems = items.reduce((acc, item) => {
        acc[item.product._id] = item;
        return acc;
      }, {} as Record<string, CartData>);
      state.totalItems = items.length;
      state.subTotal = items.reduce((acc, item) => {
        return acc + parseFloat(item.product.price) * item.quantity;
      }, 0);
    },
    addItemToCart: (state, action) => {
      const item = action.payload as CartProductData;
      if (state.cartItems[item._id]) {
        return;
      } else {
        state.cartItems[item._id] = { ...item, quantity: 1, product: item };
        state.totalItems += 1;
      }
      state.subTotal += parseFloat(item.price);
    },
    removeFromCart: (state, action) => {
      const item = action.payload as CartData;

      if (Object.entries(state.cartItems).length === 1) {
        state.subTotal = 0;
        state.totalItems = 0;
      } else {
        state.subTotal -=
          parseFloat(item.product.price) *
          state.cartItems[item.product._id].quantity;
        state.totalItems -= 1;
      }

      delete state.cartItems[item.product._id];
    },
    decreaseQuantityByOne: (state, action) => {
      const item = action.payload as CartData;
      if (state.cartItems[item.product._id].quantity === 1) {
        delete state.cartItems[item.product._id];
        state.totalItems -= 1;
        if (Object.entries(state.cartItems).length === 0) {
          state.subTotal = 0;
          return;
        }
      } else {
        state.cartItems[item.product._id].quantity -= 1;
      }
      state.subTotal -= parseFloat(parseFloat(item.product.price).toFixed(2));
    },
    increaseQuantityByOne: (state, action) => {
      const item = action.payload as CartData;
      state.cartItems[item.product._id].quantity += 1;
      state.subTotal += parseFloat(parseFloat(item.product.price).toFixed(2));
    },
  },
});

export const {
  addItemToCart,
  removeFromCart,
  decreaseQuantityByOne,
  increaseQuantityByOne,
  setCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
