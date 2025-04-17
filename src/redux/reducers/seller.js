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

    case "LoadSellerFail":
      return {
        ...state,
        isLoading: false,
        seller: null,
        error: action.payload,
      };

    // --- Admin Access: Get All Sellers ---
    case "getAllSellersRequest":
      return {
        ...state,
        isLoading: true,
      };

    case "getAllSellersSuccess":
      return {
        ...state,
        isLoading: false,
        sellers: action.payload,
        error: null,
      };

    case "getAllSellersFailed":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case "clearErrors":
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
