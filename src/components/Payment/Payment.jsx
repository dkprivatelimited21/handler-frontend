import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { server } from "../../server";

const Payment = () => {
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({});
  const [selectedSellerId, setSelectedSellerId] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const orderData = JSON.parse(localStorage.getItem("latestOrder"));

      if (!orderData || !orderData.cart || !orderData.user) {
        toast.error("No valid order data found!");
        navigate("/checkout");
        return;
      }

      setCartItems(orderData.cart);
      setUser(orderData.user);
      setTotalPrice(Number(orderData.totalPrice) || 0);
      setShippingAddress(orderData.shippingAddress || {});
      setSelectedSellerId(orderData.cart[0]?.shopId || null);
      setSelectedSize(orderData.cart[0]?.selectedSize || null);
      setSelectedColor(orderData.cart[0]?.selectedColor || null);

      console.log("Loaded order data:", orderData);
    } catch (err) {
      console.error("Error loading order data:", err);
      toast.error("Order data corrupted. Redirecting...");
      navigate("/checkout");
    }
  }, [navigate]);

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
      const { data: keyData } = await axios.get(`${server}/payment/razorpay-key`, { withCredentials: true });


      const orderPayload = { amount: totalPrice * 100 };
      const { data } = await axios.post(`${server}/payment/razorpay-checkout`, orderPayload)
;

      const options = {
        key: keyData.key,
        amount: data.amount,
        currency: data.currency,
        name: "Local Handler",
        description: "Order Payment",
        order_id: data.id,
        handler: async function (response) {
          const payload = {
  cart: cartItems,
  shippingAddress,
  user,
  totalPrice,
  paymentInfo: {
    id: response.razorpay_payment_id,
    orderId: response.razorpay_order_id,
    signature: response.razorpay_signature,
    status: "Paid",
    method: "Razorpay",
  },
};

console.log("totalPrice type:", typeof totalPrice); // should be 'number'


         const confirm = await axios.post(`${server}/order/create-order`, payload, {
  withCredentials: true
});


          if (confirm.data.success) {
            toast.success("Payment successful and order placed!");
            localStorage.removeItem("latestOrder");
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

  if (!user || cartItems.length === 0) {
    return <div className="p-4 text-center text-gray-600">Loading payment data...</div>;
  }

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
