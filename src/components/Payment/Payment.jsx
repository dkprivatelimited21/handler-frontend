import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Payment = ({ cartItems, user, selectedSize, selectedColor, totalPrice, shippingAddress, selectedSellerId }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

 const handleRazorpayPayment = async () => {
  setLoading(true);
  const res = await loadRazorpayScript();

  if (!res) {
    toast.error("Razorpay SDK failed to load. Are you online?");
    setLoading(false);
    return;
  }

  try {
    // ✅ Step 1: Fetch Razorpay key from backend
    const { data: keyData } = await axios.get("/api/payment/razorpay-key");

    // ✅ Step 2: Create Razorpay order
    const orderPayload = { amount: totalPrice * 100 }; // amount in paise
    const { data } = await axios.post("/api/payment/razorpay-checkout", orderPayload);

    const options = {
      key: keyData.key, // ✅ securely injected from backend
      amount: data.amount,
      currency: data.currency,
      name: "Local Handler",
      description: "Order Payment",
      order_id: data.id,
      handler: async function (response) {
        const payload = {
          items: cartItems,
          shippingAddress,
          buyer: user._id,
          seller: selectedSellerId,
          size: selectedSize,
          color: selectedColor,
          totalAmount: totalPrice,
          isPaid: true,
          paymentMethod: 'Razorpay',
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };

        const confirm = await axios.post('/api/order/create-order', payload);

        if (confirm.data.success) {
          toast.success("Payment successful and order placed!");
          navigate(`/order/success/${confirm.data.order._id}`);
        } else {
          toast.error("Order creation failed after payment.");
        }
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.phone || user.contact || "",
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Razorpay error:", error);
    toast.error("Something went wrong during Razorpay payment.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="payment-container p-4">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>

      <button
        onClick={handleRazorpayPayment}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Now with Razorpay'}
      </button>
    </div>
  );
};

export default Payment;
