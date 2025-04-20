import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { server } from '../../server';

const Payment = () => {
  const [orderData, setOrderData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const latestOrder = JSON.parse(localStorage.getItem('latestOrder'));
    if (!latestOrder) {
      toast.error("No order data found!");
      navigate("/checkout");
    } else {
      setOrderData(latestOrder);
    }
  }, [navigate]);

  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error("Razorpay SDK failed to load.");
        setLoading(false);
        return;
      }

      const { data: keyData } = await axios.get(`${server}/payment/razorpay-key`);
      const { data: order } = await axios.post(`${server}/payment/razorpay-checkout`, {
        amount: Math.round(orderData.totalPrice * 100),
      });

      const options = {
        key: keyData.key,
        amount: order.amount,
        currency: order.currency,
        name: "Local Handler",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          const payload = {
            ...orderData,
            totalPrice: Number(orderData.totalPrice),
            paymentInfo: {
              id: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              status: "Paid",
              method: "Razorpay",
            },
          };

          try {
  const confirm = await axios.post(`${server}/order/create-order`, payload, {
    headers: { "Content-Type": "application/json" },
  });

  if (confirm.data.success) {
    toast.success("Payment successful and order placed!");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("latestOrder");
    navigate(`/order/success/${confirm.data.orders[0]._id}`);
  } else {
    toast.error("Order creation failed after payment.");
  }
} catch (error) {
  console.error("🔥 Order creation error:", error);
  toast.error(
    error?.response?.data?.message || "Order creation failed due to server error."
  );
};

        prefill: {
          name: orderData.user?.name || "",
          email: orderData.user?.email || "",
          contact: orderData.user?.phone || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Something went wrong during payment.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  if (!orderData.totalPrice) {
    return <div className="p-4 text-center text-gray-600">Loading order...</div>;
  }

  return (
    <div className="p-6 flex justify-center">
      <button
        onClick={handleRazorpayPayment}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
      >
        {loading ? "Processing..." : "Pay Now with Razorpay"}
      </button>
    </div>
  );
};

export default Payment;
