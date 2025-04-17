import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  seller: null,
  error: null,
};

export const sellerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LoadSellerRequest":
      return {
        ...state,
        isLoading: true,
      };
    case "LoadSellerSuccess":
      return {
        isLoading: false,
        seller: action.payload,
        error: null,
      };
    case "LoadSellerFail":
      return {
        isLoading: false,
        seller: null,
        error: action.payload,
      };
    default:
      return state;
  },

  // get all sellers ---admin
  getAllSellersRequest: (state) => {
    state.isLoading = true;
  },
  getAllSellersSuccess: (state, action) => {
    state.isLoading = false;
    state.sellers = action.payload;
  },
  getAllSellerFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  clearErrors: (state) => {
    state.error = null;
  },
});
