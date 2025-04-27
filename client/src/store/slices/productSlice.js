import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  loading: false,
  error: null,
  searchResults: [],
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    searchProducts: (state, action) => {
      state.searchResults = action.payload;
    },
    clearSearch: (state) => {
      state.searchResults = [];
    },
  },
});

export const {
  setProducts,
  setLoading,
  setError,
  searchProducts,
  clearSearch,
} = productSlice.actions;

export default productSlice.reducer; 