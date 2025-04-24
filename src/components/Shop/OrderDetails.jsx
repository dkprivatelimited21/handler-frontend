import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";

const courierOptions = [
  { value: "delhivery", label: "Delhivery" },
  { value: "bluedart", label: "Blue Dart" },
  { value: "ekart", label: "Ekart" },
  { value: "ecomExpress", label: "Ecom Express" },
  { value: "xpressbees", label: "Xpressbees" },
  { value: "shadowfax", label: "Shadowfax" },
];

const refundOptions = ["Processing refund", "Refund Success"];

const OrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [courier, setCourier] = useState("");
  const [status, setStatus] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [initialStatus, setInitialStatus] = useState("");

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const order = orders?.find((item) => item._id === id);

  useEffect(() => {
    if (order?.status) {
      setStatus(order.status);
      setInitialStatus(order.status);
    } else {
      setStatus("Not Shipped");
    }
  }, [order]);

  const isValidTrackingId = (id) => {
    const patterns = {
      delhivery: /^[0-9]{9,14}$/,
      bluedart: /^[A-Z0-9]{8,12}$/,
      ekart: /^FMPC[0-9A-Z]{8,12}$/,
      ecomExpress: /^[A-Z]{2}[0-9]{9}$/,
      xpressbees: /^XB[0-9]{9}$/,
      shadowfax: /^[A-Z0-9]{10,15}$/,
    };
    const isMatchingPattern = Object.values(patterns).some((pattern) => pattern.test(id));
    const isRepeated = /^([A-Za-z0-9])\1+$/.test(id);
    const sequentialPatterns = ["123456789", "987654321", "0123456789", "9876543210"];
    const isSequential = sequentialPatterns.includes(id);
    return isMatchingPattern && !isRepeated && !isSequential;
  };

  const orderUpdateHandler = async () => {
    try {
      if (initialStatus === "Delivered") {
        toast.error("Order already delivered. Status change is locked.");
        return;
      }

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

      if (status === "Delivered") {
        await axios.post(`${server}/payment/release-to-seller`, { orderId: id }, { withCredentials: true });
      }

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
        <h5 className="text-[#00000084]">Order ID: <span>#{order?._id?.slice(0, 8)}</span></h5>
        <h5 className="text-[#00000084]">Placed on: <span>{order?.createdAt?.slice(0, 10)}</span></h5>
      </div>

      <br /><br />
      {order?.cart?.map((item, idx) => (
        <div className="w-full flex items-start mb-5" key={idx}>
         <img
  src={item?.images?.[0]?.url}
  alt={item?.name}
  className="w-[80px] h-[80px]"
/>

          <div className="w-full">
            <h5 className="pl-3 text-[18px]">{item.name}</h5>
            <h5 className="pl-3 text-[15px] text-[#00000091] leading-6">
              US${item.discountPrice || item.price} × {item.quantity || 0}<br />
              Size: {item.selectedSize || "-"} | Color: {item.selectedColor || "-"}
            </h5>
          </div>
        </div>
      ))}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">Total Price: <strong>US${order?.totalPrice}</strong></h5>
      </div>

      <br /><br />
      <div className="w-full 800px:flex">
        <div className="w-full 800px:w-[60%]">
          <h4 className="text-[20px] font-[600]">Shipping Address:</h4>
          <h4 className="text-[18px] pt-2">{order?.shippingAddress?.address1} {order?.shippingAddress?.address2}</h4>
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

      {refundOptions.includes(order?.status) ? (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
        >
          {refundOptions
            .slice(refundOptions.indexOf(order?.status))
            .map((option, i) => (
              <option value={option} key={i}>{option}</option>
            ))}
        </select>
      ) : (
        <>
          <h5 className="text-[18px] text-gray-800 mt-2">
            Current Status: <strong>{order?.status || "Not Shipped"}</strong>
          </h5>
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
              "Delivered"
            ].filter((option) =>
              order?.status === "Shipping"
                ? option === "Delivered"
                : true
            ).map((option, i) => (
              <option key={i} value={option}>{option}</option>
            ))}
          </select>

          {status === "Shipping" && (
            <>
              <div className="mt-2">
                <label htmlFor="courier" className="text-[16px] font-medium">Select Courier:</label>
                <select
                  id="courier"
                  className="border p-2 rounded w-[300px] mt-1"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                >
                  <option value="">Select Courier</option>
                  {courierOptions.map((c, i) => (
                    <option key={i} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                name="trackingId"
                placeholder="Enter Tracking ID"
                className="border p-2 rounded w-[300px] mt-2"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
              />
            </>
          )}
        </>
      )}

      <div
        className={`${styles.button} mt-5 bg-[#FCE1E6] text-[#E94560] font-[600] h-[45px] text-[18px]`}
        onClick={order?.status !== "Processing refund" ? orderUpdateHandler : refundOrderUpdateHandler}
      >
        Update Status
      </div>

      <a
  href={`${server}/order/download-invoice/${order?._id}`}  // Fixing the path here
  className={`${styles.button} mt-5 bg-green-500 text-white font-[600] h-[45px] text-[18px] flex items-center justify-center`}
  target="_blank"
  rel="noopener noreferrer"
>
  Download Invoice PDF
</a>

    </div>
  );
};

export default OrderDetails;
