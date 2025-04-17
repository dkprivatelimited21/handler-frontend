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


// user update information
export const updateUserInformation =
  (name, email, phoneNumber, password) => async (dispatch) => {
    try {
      dispatch({
        type: "updateUserInfoRequest",
      });

      const { data } = await axios.put(
        `${server}/user/update-user-info`,
        {
          email,
          password,
          phoneNumber,
          name,
        },
        {
          withCredentials: true,
          headers: {
            "Access-Control-Allow-Credentials": true,
          },
        }
      );

      dispatch({
        type: "updateUserInfoSuccess",
        payload: data.user,
      });
    } catch (error) {
      dispatch({
        type: "updateUserInfoFailed",
        payload: error.response.data.message,
      });
    }
  };

// update user address
export const updatUserAddress =
  (country, city, address1, address2, zipCode, addressType) =>
  async (dispatch) => {
    try {
      dispatch({
        type: "updateUserAddressRequest",
      });

      const { data } = await axios.put(
        `${server}/user/update-user-addresses`,
        {
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType,
        },
        { withCredentials: true }
      );

      dispatch({
        type: "updateUserAddressSuccess",
        payload: {
          successMessage: "User address updated succesfully!",
          user: data.user,
        },
      });
    } catch (error) {
      dispatch({
        type: "updateUserAddressFailed",
        payload: error.response.data.message,
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





// load seller
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadSellerRequest",
    });
    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    });
    dispatch({
      type: "LoadSellerSuccess",
      payload: data.seller,
    });
  } catch (error) {
    dispatch({
      type: "LoadSellerFail",
      payload: error.response.data.message,
    });
  }
};







// get all users --- admin
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllUsersRequest",
    });

    const { data } = await axios.get(`${server}/user/admin-all-users`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllUsersSuccess",
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: "getAllUsersFailed",
      payload: error.response.data.message,
    });
  }
};

