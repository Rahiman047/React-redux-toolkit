import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartItems from "../../cartItems";

const url = "https://course-api.com/react-useReducer-cart-project";

const initialState = {
  cartItems: cartItems,
  total: 0,
  amount: 4,
  isLoading: true,
};

export const getCartItems = createAsyncThunk("cart/getCartItems", () => {
  return fetch(url)
    .then((resp) => resp.json())
    .catch((err) => console.log(err));
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      const removeId = action.payload;
      state.cartItems = state.cartItems.filter(
        (eachItem) => eachItem.id !== removeId
      );
    },
    increaseAmount: (state, action) => {
      const itemId = action.payload;
      const item = state.cartItems.find((item) => item.id === itemId);
      item.amount = item.amount + 1;
    },
    decreaseAmount: (state, action) => {
      const itemId = action.payload;
      const item = state.cartItems.find((item) => item.id === itemId);
      item.amount = item.amount - 1;
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total.toFixed(2);
    },
  },
  extraReducers: {
    [getCartItems.pending]: (state, action) => {
      state.isLoading = true;
    },
    [getCartItems.fulfilled]: (state, action) => {
      state.isLoading = false;
      const data = action.payload;
      state.cartItems = data;
    },
    [getCartItems.rejected]: (state, action) => {
      state.isLoading = false;
    },
  },
});

export const {
  clearCart,
  removeItem,
  increaseAmount,
  decreaseAmount,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
