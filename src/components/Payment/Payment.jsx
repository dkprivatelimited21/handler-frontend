// ✅ Cleaned and integrated version of Payment.jsx with UPI only and INR-based logic
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const [upiMethod, setUpiMethod] = useState("");
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem("latestOrder"));
    if (!orderData) return toast.error("No order data found");
    setOrderData(orderData);
  }, []);

  const orderHandler = async () => {
    if (!upiMethod) {
      toast.error("Please select a UPI payment method.");
      return;
    }

    const order = {
      cart: orderData?.cart,
      shippingAddress: orderData?.shippingAddress,
      user: user,
      totalPrice: orderData?.totalPrice,
      paymentInfo: {
        method: upiMethod,
        status: "Pending",
        type: "UPI",
      },
    };

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      await axios.post(`${server}/order/create-order`, order, config);
      toast.success("Order placed using " + upiMethod);
      localStorage.setItem("cartItems", JSON.stringify([]));
      localStorage.setItem("latestOrder", JSON.stringify([]));
      navigate("/order/success");
    } catch (error) {
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <div className="bg-white p-5 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-4">Select UPI Payment Method</h2>
            <div className="flex flex-col gap-2">
              {["PhonePe", "Google Pay", "Other UPI"].map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="upi"
                    value={method}
                    checked={upiMethod === method}
                    onChange={(e) => setUpiMethod(e.target.value)}
                  />
                  {method}
                </label>
              ))}
            </div>
            <button
              onClick={orderHandler}
              className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Confirm & Place Order
            </button>
          </div>
        </div>

        <div className="w-full 800px:w-[35%] mt-8 800px:mt-0">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8 shadow-md">
      <div className="flex justify-between">
        <h3 className="text-[16px] text-gray-600">Subtotal:</h3>
        <h5 className="text-[18px] font-semibold text-gray-800">₹{orderData?.subTotalPrice}</h5>
      </div>
      <div className="flex justify-between my-2">
        <h3 className="text-[16px] text-gray-600">Shipping:</h3>
        <h5 className="text-[18px] font-semibold text-gray-800">₹{orderData?.shipping?.toFixed(2)}</h5>
      </div>
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] text-gray-600">Discount:</h3>
        <h5 className="text-[18px] font-semibold text-gray-800">
          {orderData?.discountPrice ? `- ₹${orderData.discountPrice}` : "-"}
        </h5>
      </div>
      <div className="flex justify-between pt-3">
        <h3 className="text-[18px] font-bold">Total:</h3>
        <h5 className="text-[20px] font-bold text-green-600">₹{orderData?.totalPrice}</h5>
      </div>
    </div>
  );
};

export default Payment;