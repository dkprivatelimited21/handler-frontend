import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Payment = ({ cartItems, user, selectedSize, selectedColor, totalPrice, shippingAddress, selectedSellerId }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFakePayNow = async () => {
    setLoading(true);
    try {
      const payload = {
        items: cartItems,
        shippingAddress,
        buyer: user._id,
        seller: selectedSellerId,
        size: selectedSize,
        color: selectedColor,
        totalAmount: totalPrice,
        isPaid: false,
        paymentMethod: 'Pay Now (No Actual Payment)',
      };

      const { data } = await axios.post('/api/order/create-order', payload);

      if (data.success) {
        toast.success('Order placed successfully without real payment!');
        navigate(`/order/success/${data.order._id}`);
      } else {
        toast.error('Failed to place fake paid order.');
      }
    } catch (error) {
      console.error('Payment simulation error:', error);
      toast.error('Something went wrong during fake payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container p-4">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>

      {/* Optional real payment logic can be added here */}

      <button
        onClick={handleFakePayNow}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Now (Fake)'}
      </button>
    </div>
  );
};

export default Payment;
