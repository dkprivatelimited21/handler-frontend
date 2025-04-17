import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  seller: null,
  sellers: [],
  error: null,
};

export const sellerReducer = (state = initialState, action) => {
  switch (action.type) {
    // Load current logged-in seller
    case "LoadSellerRequest":
    case "getAllSellersRequest":
      return {
        ...state,
        isLoading: true,
      };

    case "LoadSellerSuccess":
      return {
        ...state,
        isLoading: false,
        seller: action.payload,
        error: null,
      };

    case "getAllSellersSuccess":
      return {
        ...state,
        isLoading: false,
        sellers: action.payload,
        error: null,
      };

    case "LoadSellerFail":
    case "getAllSellerFailed":
      return {
        ...state,
        isLoading: false,
        seller: null,
        error: action.payload,
      };

    case "clearErrors":
      return {
        ...state,
        error: null,
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
