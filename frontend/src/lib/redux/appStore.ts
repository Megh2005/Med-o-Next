import { configureStore } from "@reduxjs/toolkit";
import searchSlice from "./slices/searchSlice";
import filterSlice from "./slices/filterSlice";
import cartSlice from "./slices/cartSlice";

const appStore = configureStore({
  reducer: {
    search: searchSlice,
    filter: filterSlice,
    cart: cartSlice,
  },
});

export default appStore;
