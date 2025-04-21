import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [courier, setCourier] = useState("");

  const [status, setStatus] = useState("");
  const [trackingId, setTrackingId] = useState("");

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const order = orders?.find((item) => item._id === id);


useEffect(() => {
  {status === "Shipping" && (
  <>
    <div className="mt-2">
      <label className="text-[16px] font-medium">Select Courier:</label>
      <select
        className="border p-2 rounded w-[300px] mt-1"
        value={courier}
        onChange={(e) => setCourier(e.target.value)}
      >
        <option value="">Select Courier</option>
        <option value="delhivery">Delhivery</option>
        <option value="bluedart">Blue Dart</option>
        <option value="ekart">Ekart</option>
        <option value="ecomExpress">Ecom Express</option>
        <option value="xpressbees">Xpressbees</option>
        <option value="shadowfax">Shadowfax</option>
      </select>
    </div>

    <input
      type="text"
      placeholder="Enter Tracking ID"
      className="border p-2 rounded w-[300px] mt-2"
      value={trackingId}
      onChange={(e) => setTrackingId(e.target.value)}
    />
  </>
)}


const orderUpdateHandler = async () => {
  if (status === "Shipping") {
  const trimmedId = trackingId.trim();
  if (!courier || !trimmedId) {
    toast.error("Courier and tracking ID are required");
    return;
  }

  if (!isValidTrackingId(trimmedId)) {
    toast.error("Invalid tracking ID format.");
    return;
  }
}

await axios.put(
  `${server}/order/update-order-status/${id}`,
  {
    status,
    ...(status === "Shipping" && {
      trackingId: trackingId.trim(),
      courier,
    }),
  },
  { withCredentials: true }
);

    toast.success("Order updated!");
    navigate("/dashboard-orders");
  } catch (error) {
    toast.error(error.response?.data?.message || "Update failed");
  }
};


  const refundOrderUpdateHandler = async () => {
    try {
      await axios.put(
        `${server}/order/order-refund-success/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success("Refund status updated!");
      dispatch(getAllOrdersOfShop(seller._id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Refund update failed");
    }
  };

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Order Details</h1>
        </div>
        <Link to="/dashboard-orders">
          <div className={`${styles.button} bg-[#fce1e6] text-[#e94560] font-[600] h-[45px]`}>
            Order List
          </div>
        </Link>
      </div>

      <div className="w-full flex justify-between pt-6">
        <h5 className="text-[#00000084]">
          Order ID: <span>#{order?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Placed on: <span>{order?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      <br /><br />
      {order?.cart?.map((item, idx) => (
        <div className="w-full flex items-start mb-5" key={idx}>
          <img
            src={item?.image || item?.images?.[0]?.url || ""}
            alt=""
            className="w-[80px] h-[80px] object-cover"
          />
          <div className="w-full">
            <h5 className="pl-3 text-[18px]">{item.name}</h5>
            <h5 className="pl-3 text-[15px] text-[#00000091] leading-6">
              US${item.discountPrice || item.price} × {item.quantity || 0}
              <br />
              Size: {item.selectedSize || "-"} | Color: {item.selectedColor || "-"}
            </h5>
          </div>
        </div>
      ))}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>US${order?.totalPrice}</strong>
        </h5>
      </div>

      <br /><br />
      <div className="w-full 800px:flex">
        <div className="w-full 800px:w-[60%]">
          <h4 className="text-[20px] font-[600]">Shipping Address:</h4>
          <h4 className="text-[18px] pt-2">
            {order?.shippingAddress?.address1} {order?.shippingAddress?.address2}
          </h4>
          <h4 className="text-[18px]">{order?.shippingAddress?.city}</h4>
          <h4 className="text-[18px]">{order?.shippingAddress?.country}</h4>
          <h4 className="text-[18px]">{order?.user?.phoneNumber || "-"}</h4>
        </div>
        <div className="w-full 800px:w-[40%]">
          <h4 className="text-[20px] font-[600]">Payment Info:</h4>
          <h4>Status: {order?.paymentInfo?.status || "Not Paid"}</h4>
        </div>
      </div>

      <br /><br />
      <h4 className="text-[20px] font-[600]">Order Status:</h4>

      {["Processing refund", "Refund Success"].includes(order?.status) ? (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
        >
          {["Processing refund", "Refund Success"]
            .slice(["Processing refund", "Refund Success"].indexOf(order?.status))
            .map((option, i) => (
              <option value={option} key={i}>
                {option}
              </option>
            ))}
        </select>
      ) : (
        <>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-[250px] mt-2 border h-[35px] rounded-[5px]"
          >
            {[
              "Not Shipped",
              "Processing",
              "Transferred to delivery partner",
              "Shipping",
              "Received",
              "On the way",
              "Delivered",
            ].map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>

          {status === "Shipping" && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Enter Tracking ID"
                className="border p-2 rounded w-[300px]"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
            </div>
          )}
        </>
      )}

      <div
        className={`${styles.button} mt-5 bg-[#FCE1E6] text-[#E94560] font-[600] h-[45px] text-[18px]`}
        onClick={
          order?.status !== "Processing refund"
            ? orderUpdateHandler
            : refundOrderUpdateHandler
        }
      >
        Update Status
      </div>
    </div>
  );
};

export default OrderDetails;
