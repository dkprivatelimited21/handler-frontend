import React, { useEffect, useState } from "react";
import styles from "../styles/styles";
import axios from "axios";
import { server } from "../server";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Payment = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const { shippingAddress } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [loadingRazorpay, setLoadingRazorpay] = useState(false);

  // Calculate order totals
  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );
  const shipping = subTotalPrice * 0.1;
  const totalPrice = subTotalPrice + shipping;

  const order = {
    cart,
    shippingAddress,
    user,
    totalPrice,
  };

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleRazorpay = async () => {
    setLoadingRazorpay(true);

    try {
      // Get Razorpay public key from backend
      const { data: keyData } = await axios.get(`${server}/payment/razorpay-key`, {
        withCredentials: true,
      });

      // Create Razorpay order from backend
      const { data: orderData } = await axios.post(
        `${server}/payment/razorpay-checkout`,
        { amount: totalPrice * 100 },
        { withCredentials: true }
      );

      const options = {
        key: keyData.key,
        amount: orderData.amount,
        currency: "INR",
        name: "LocalHandler",
        description: "Order Payment",
        order_id: orderData.id,
        handler: async (response) => {
          try {
            const config = {
              headers: { "Content-Type": "application/json" },
            };

            order.paymentInfo = {
              id: response.razorpay_payment_id,
              status: "succeeded",
              type: "UPI",
            };

            await axios.post(`${server}/order/create-order`, order, config);

            toast.success("Order placed successfully!");
            localStorage.setItem("cartItems", JSON.stringify([]));
            localStorage.setItem("latestOrder", JSON.stringify([]));
            navigate("/order/success");
          } catch (error) {
            toast.error("Order creation failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#f63b60" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      toast.error("Payment failed, please try again");
    } finally {
      setLoadingRazorpay(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] max-w-[500px] border border-gray-300 rounded-md p-6 shadow-md bg-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Pay using UPI (Razorpay)</h2>

        <button
          onClick={handleRazorpay}
          disabled={loadingRazorpay}
          className={`${styles.button} !bg-[#f63b60] text-white w-full h-[45px] rounded-md font-semibold flex items-center justify-center`}
        >
          {loadingRazorpay ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            "Pay Now"
          )}
        </button>
      </div>
    </div>
  );
};

export default Payment;
