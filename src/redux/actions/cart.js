export const addTocart = (data) => async (dispatch, getState) => {
  const itemWithShopId = {
    ...data,
    shopId: data.shop?._id || data.shopId || "", // safely include shopId
  };

  dispatch({
    type: "addToCart",
    payload: itemWithShopId,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  return itemWithShopId;
};


// remove from cart
export const removeFromCart = (data) => async (dispatch, getState) => {
  dispatch({
    type: "removeFromCart",
    payload: data._id,
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  return data;
};
