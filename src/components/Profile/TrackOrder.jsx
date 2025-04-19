import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const statusMessages = {
  "Processing": "Your Order is processing in shop.",
  "Transferred to delivery partner": "Your Order is on the way for delivery partner.",
  "Shipping": "Your Order is on the way with our delivery partner.",
  "Received": "Your Order is in your city. Our Delivery man will deliver it.",
  "On the way": "Our Delivery man is going to deliver your order.",
  "Delivered": "Your order is delivered!",
  "Processing refund": "Your refund is processing!",
  "Refund Success": "Your Refund is success!",
};

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user?._id]);

  const data = orders?.find((item) => item._id === id);

  return (
    <div className="w-full h-[80vh] flex justify-center items-center">
      <h1 className="text-[20px]">
        {data ? statusMessages[data.status] : "Order not found or loading..."}
      </h1>
    </div>
  );
};

export default TrackOrder;
