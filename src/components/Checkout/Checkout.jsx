import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Checkout = ({ cartItems, user, selectedSize, selectedColor, totalPrice, shippingAddress, selectedSellerId }) => {
  const [loading, setLoading] = useState(false);
  const [payNowLoading, setPayNowLoading] = useState(false);
  const navigate = useNavigate();

  const createOrder = async (isPaid = false, paymentMethod = 'Pending') => {
    try {
      const payload = {
        items: cartItems,
        shippingAddress,
        buyer: user._id,
        seller: selectedSellerId,
        size: selectedSize,
        color: selectedColor,
        totalAmount: totalPrice,
        isPaid,
        paymentMethod,
      };

      const { data } = await axios.post('/api/order/create-order', payload);

      if (data.success) {
        toast.success('Order placed successfully!');
        navigate(`/order/success/${data.order._id}`);
      } else {
        toast.error('Failed to place order.');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      toast.error('Something went wrong while placing the order.');
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    await createOrder(false, 'Pending');
    setLoading(false);
  };

  const handlePayNow = async () => {
    setPayNowLoading(true);
    await createOrder(false, 'Pay Now (No Actual Payment)');
    setPayNowLoading(false);
  };

  return (
    <div className="checkout-container p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      {/* Add your cart summary and shipping address UI here */}

      <div className="flex gap-4">
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Placing Order...' : 'Place Order Without Payment'}
        </button>

        <button
          onClick={handlePayNow}
          disabled={payNowLoading}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
        >
          {payNowLoading ? 'Confirming...' : 'Pay Now (Fake)'}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
