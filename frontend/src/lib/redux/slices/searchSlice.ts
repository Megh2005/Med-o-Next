import { createSlice } from "@reduxjs/toolkit";
import { ProductData } from "../../interfaces/Product";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    query: "",
    results: [] as ProductData[],
    loading: true,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },
    setSearchResults: (state, action) => {
      state.results = action.payload;
    },
    setSearchLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setSearchQuery, setSearchResults, setSearchLoading } =
  searchSlice.actions;
export default searchSlice.reducer;
