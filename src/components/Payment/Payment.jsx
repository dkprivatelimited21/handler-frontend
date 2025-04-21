import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Payment = () => {
  const [orderData, setOrderData] = useState([]);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const localOrderData = JSON.parse(localStorage.getItem("latestOrder"));
    setOrderData(localOrderData);
  }, []);

  const razorpayPaymentHandler = async () => {
    try {
      const { data: keyData } = await axios.get(`${server}/payment/get-razorpay-key`);

      const razorpayOrder = await axios
        .post(`${server}/payment/razorpay-checkout`, {
          amount: Math.round(orderData?.totalPrice * 100),
        })
        .then((res) => res.data);

      // ✅ Fix: Inject shopId before creating order
      const cartWithRequiredFields = orderData?.cart?.map((item) => ({
  productId: item._id,
  quantity: item.qty || 1,
  selectedSize: item.selectedSize || "",
  selectedColor: item.selectedColor || "",
  shopId: item.shop?._id || item.shopId || item.shop_id || "",
}));


      const order = {
  cart: cartWithRequiredFields,
  shippingAddress: orderData?.shippingAddress,
  user: user && user,
  totalPrice: orderData?.totalPrice,
  paymentInfo: {
    id: razorpayOrder.id,
    status: "succeeded",
    type: "Razorpay",
  },
};


      const options = {
        key: keyData.key,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "Local Handler",
        description: "Test Transaction",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          order.paymentInfo.id = response.razorpay_payment_id;
console.log("ORDER SENDING TO BACKEND:", JSON.stringify(order, null, 2));
          await axios.post(`${server}/order/create-order`, order, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          toast.success("Order successful!");
          localStorage.setItem("cartItems", JSON.stringify([]));
          localStorage.setItem("latestOrder", JSON.stringify([]));
          navigate("/order/success");
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: "#f63b60",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed");
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <div className="w-full 800px:w-[95%] bg-[#fff] rounded-md p-5 pb-8">
            <h4 className="text-[18px] font-[600] text-[#000000b1] pb-4">
              Pay with Razorpay
            </h4>
            <button
              onClick={razorpayPaymentHandler}
              className={`${styles.button} !bg-[#f63b60] text-[#fff] h-[45px] rounded-[5px] cursor-pointer text-[18px] font-[600]`}
            >
              Pay Now
            </button>
          </div>
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData orderData={orderData} />
        </div>
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  const shipping = (orderData?.shipping ?? 0).toFixed(2);
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">subtotal:</h3>
        <h5 className="text-[18px] font-[600]">${orderData?.subTotalPrice}</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">shipping:</h3>
        <h5 className="text-[18px] font-[600]">${shipping}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Discount:</h3>
        <h5 className="text-[18px] font-[600]">
          {orderData?.discountPrice ? "$" + orderData.discountPrice : "-"}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">
        ${orderData?.totalPrice}
      </h5>
      <br />
    </div>
  );
};

export default Payment;
