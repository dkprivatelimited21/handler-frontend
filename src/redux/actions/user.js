// user.js – cleaned and fixed version
import axios from "axios";
import { server } from "../../server";

// Register user
export const registerUser = (user) => async (dispatch) => {
  try {
    dispatch({ type: "RegisterUserRequest" });

    const { data } = await axios.post(`${server}/user/create-user`, user, {
      withCredentials: true,
    });

    dispatch({ type: "RegisterUserSuccess", payload: data.user });
  } catch (error) {
    dispatch({
      type: "RegisterUserFail",
      payload: error?.response?.data?.message || error.message,
    });
  }
};

// Load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });

    const { data } = await axios.get(`${server}/user/getuser`, {
      withCredentials: true,
    });

    dispatch({ type: "LoadUserSuccess", payload: data.user });
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error?.response?.data?.message || error.message,
    });
  }
};

// Logout
export const logoutUser = () => async (dispatch) => {
  try {
    await axios.get(`${server}/user/logout`, {
      withCredentials: true,
    });

    dispatch({ type: "LogoutSuccess" });
  } catch (error) {
    dispatch({
      type: "LogoutFail",
      payload: error?.response?.data?.message || error.message,
    });
  }
};

// Update user address
export const updateUserAddress = (address) => async (dispatch) => {
  try {
    dispatch({ type: "UpdateUserAddressRequest" });

    const { data } = await axios.put(`${server}/user/update-addresses`, address, {
      withCredentials: true,
    });

    dispatch({ type: "UpdateUserAddressSuccess", payload: data.user });
  } catch (error) {
    dispatch({
      type: "UpdateUserAddressFail",
      payload: error?.response?.data?.message || error.message,
    });
  }
};

// Delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch({ type: "DeleteUserAddressRequest" });

    const { data } = await axios.delete(`${server}/user/delete-address/${id}`, {
      withCredentials: true,
    });

    dispatch({ type: "DeleteUserAddressSuccess", payload: data.user });
    dispatch({ type: "SuccessMessage", payload: "Address deleted successfully!" });
  } catch (error) {
    dispatch({
      type: "DeleteUserAddressFail",
      payload: error?.response?.data?.message || error.message,
    });
  }
};
