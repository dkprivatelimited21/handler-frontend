import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/styles";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { toast } from "react-toastify";
import { server } from "../../server";
import Loader from "./Layout/Loader";
import { loadSeller } from "../redux/actions/user";

const UserOrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch order details
  const getOrderDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${server}/order/${id}`, {
        withCredentials: true,
      });
      setOrder(data.order);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Failed to load order.");
    }
  };

  useEffect(() => {
    getOrderDetails();
  }, [id]);

  // Handle "Mark as Shipped"
  const handleMarkShipped = async () => {
    const trackingId = prompt("Enter the tracking ID:");

    if (!trackingId) {
      toast.error("Tracking ID is required!");
      return;
    }

    try {
      const { data } = await axios.put(
        `${server}/order/update-order-status/${order._id}`,
        {
          status: "Shipped",
          trackingId,
        },
        { withCredentials: true }
      );

      toast.success("Order marked as shipped!");
      setOrder(data.order);
      dispatch(loadSeller());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  if (loading || !order) return <Loader />;

  const { shippingAddress } = order;

  return (
    <div className="w-full px-4 py-6 bg-white rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Order Details</h1>

      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total Price:</strong> ₹{order.totalPrice?.toFixed(2)}</p>
      {order.trackingId && (
        <p><strong>Tracking ID:</strong> {order.trackingId}</p>
      )}

      <h2 className="text-lg font-semibold mt-6 mb-2">Shipping Address:</h2>
      <div className="mb-4">
        <p><strong>Name:</strong> {shippingAddress?.name}</p>
        <p><strong>Phone Number:</strong> {shippingAddress?.phoneNumber}</p>
        <p><strong>Address:</strong> {shippingAddress?.address1}, {shippingAddress?.address2}</p>
        <p><strong>City:</strong> {shippingAddress?.city}</p>
        <p><strong>ZIP Code:</strong> {shippingAddress?.zipCode}</p>
        <p><strong>Country:</strong> {shippingAddress?.country}</p>
      </div>

      <h2 className="text-lg font-semibold mb-2">Items:</h2>
      <ul className="mb-4">
        {order.cart.map((item, index) => (
          <li key={index} className="mb-2">
            <strong>{item.name}</strong> — {item.quantity} × ₹{item.price}
            {item.selectedSize && ` | Size: ${item.selectedSize}`}
            {item.selectedColor && ` | Color: ${item.selectedColor}`}
          </li>
        ))}
      </ul>

      {seller && order.status !== "Shipped" && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleMarkShipped}
        >
          Mark as Shipped
        </Button>
      )}
    </div>
  );
};

export default UserOrderDetails;
