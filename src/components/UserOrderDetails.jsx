import React, { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/styles";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import { toast } from "react-toastify";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  useEffect(() => {
    if (orders && id) {
      const found = orders.find((order) => order._id === id);
      setData(found);
    }
  }, [orders, id]);

  const getTrackingLink = (courier, trackingId) => {
    const links = {
      delhivery: `https://www.delhivery.com/track/package/${trackingId}`,
      bluedart: `https://www.bluedart.com/tracking?tracknumbers=${trackingId}`,
      ekart: `https://ekartlogistics.com/track/${trackingId}`,
      ecomExpress: `https://ecomexpress.in/tracking/?awb_field=${trackingId}`,
      xpressbees: `https://www.xpressbees.com/track?awb=${trackingId}`,
      shadowfax: `https://www.shadowfax.in/track/${trackingId}`,
    };
    return links[courier] || `https://${courier}.com/track?tracking_id=${trackingId}`;
  };

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div id="invoice-section">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <BsFillBagFill size={30} color="crimson" />
            <h1 className="pl-2 text-[25px]">Order Details</h1>
          </div>
        </div>

        <div className="w-full flex items-center justify-between pt-6">
          <h5 className="text-[#00000084]">
            Order ID: <span>#{data?._id?.slice(0, 8)}</span>
          </h5>
          <h5 className="text-[#00000084]">
            Placed on: <span>{data?.createdAt?.slice(0, 10)}</span>
          </h5>
        </div>

        <br />
        <br />

        {Array.isArray(data?.cart) &&
          data.cart.map((item, index) => (
            <div className="w-full flex items-start mb-5" key={index}>
              <img
                src={item.image || item.images?.[0]?.url || "/default-product.png"}
                alt={item.name || "Product"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-product.png";
                }}
                className="w-[80px] h-[80px] object-cover"
              />
              <div className="w-full">
                <h5 className="pl-3 text-[20px]">{item.name}</h5>
                <h5 className="pl-3 text-[20px] text-[#00000091]">
                  INR₹{item.discountPrice} × {item.quantity}
                </h5>
                {item.selectedSize && (
                  <h5 className="pl-3 text-[16px] text-gray-700">
                    Size: <span className="font-medium">{item.selectedSize}</span>
                  </h5>
                )}
                {item.selectedColor && (
                  <div className="pl-3 flex items-center mt-1">
                    <span className="text-[16px] text-gray-700 mr-2">Color:</span>
                    <div
                      className="w-5 h-5 rounded-full border border-gray-300"
                      style={{ backgroundColor: item.selectedColor }}
                      title={item.selectedColor}
                    ></div>
                    <span className="ml-2 text-[14px] text-gray-600">{item.selectedColor}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

        <div className="border-t w-full text-right">
          <h5 className="pt-3 text-[18px]">
            Total Price: <strong>INR₹{data?.totalPrice}</strong>
          </h5>
        </div>

        <br />
        <div className="w-full 800px:flex">
          <div className="w-full 800px:w-[60%]">
            <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
            <h4 className="pt-3 text-[18px]">
              {data?.shippingAddress?.address1} {data?.shippingAddress?.address2}
            </h4>
            <h4 className="text-[18px]">{data?.shippingAddress?.city}</h4>
            <h4 className="text-[18px]">{data?.shippingAddress?.country}</h4>
            <h4 className="text-[18px]">{data?.user?.phoneNumber || "-"}</h4>
          </div>
          <div className="w-full 800px:w-[40%]">
            <h4 className="pt-3 text-[20px] font-[600]">Payment Info:</h4>
            <h4>Status: {data?.paymentInfo?.status || "Not Paid"}</h4>
          </div>
        </div>

        <br />
        <h4 className="text-[20px] font-[600] mb-2">Order Status</h4>
        <p className="text-[16px] mb-4">
          {data?.status || "Not Shipped"}
        </p>

        {data?.trackingId && data?.courier && (
          <div className="bg-white p-4 rounded shadow mt-4">
            <h4 className="text-[18px] font-medium mb-2">Tracking Info</h4>
            <p>Courier: {data.courier}</p>
            <p>Tracking ID: {data.trackingId}</p>
            <a
              href={getTrackingLink(data.courier, data.trackingId)}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline mt-2 inline-block"
              title="Click to track your shipment"
            >
              Track Your Order
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrderDetails;
