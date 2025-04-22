
import React, { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/styles";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const UserOrderDetails = () => {
  const location = useLocation();
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);
  const [autoPrint, setAutoPrint] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id);

  const downloadInvoice = async () => {
    const invoice = document.getElementById("invoice-section");
    const canvas = await html2canvas(invoice, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice_${data?._id}.pdf`);
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("print") === "true") {
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  }, [location.search]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get("pdf") === "true") {
      setAutoPrint(true);
      setTimeout(() => {
        downloadInvoice();
      }, 1000);
    }
  }, [location.search]);

  const reviewHandler = async () => {
    await axios
      .put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
        setComment("");
        setRating(null);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
  };

  const refundHandler = async () => {
    await axios
      .put(
        `${server}/order/order-refund/${id}`,
        { status: "Processing refund" },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || error.message);
      });
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

        {data &&
          data?.cart.map((item, index) => (
            <div className="w-full flex items-start mb-5" key={index}>
              <img
                src={`${item.images[0]?.url}`}
                alt=""
                className="w-[80px] h-[80px]"
              />
              <div className="w-full">
                <h5 className="pl-3 text-[20px]">{item.name}</h5>
                <h5 className="pl-3 text-[20px] text-[#00000091]">
                  INR₹{item.discountPrice} x import React, { useEffect, useState } from "react";
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
    if (order?.status) {
      setStatus(order.status);
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
    return Object.values(patterns).some((p) => p.test(id));
  };

  const orderUpdateHandler = async () => {
    try {
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
<h4>
  Order Status: <strong>{data?.status || "Not Shipped"}</strong>
</h4>


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

              {!item.isReviewed && data?.status === "Delivered" && (
                <div
                  className={`${styles.button} text-[#fff]`}
                  onClick={() => {
                    setOpen(true);
                    setSelectedItem(item);
                  }}
                >
                  Write a review
                </div>
              )}
            </div>
          ))}

        <button onClick={downloadInvoice}>Download PDF Invoice</button>
      </div>

      {open && (
        <div className="w-full fixed top-0 left-0 h-screen bg-[#0005] z-50 flex items-center justify-center">
          <div className="w-[50%] h-min bg-[#fff] shadow rounded-md p-3">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <h2 className="text-[30px] font-[500] font-Poppins text-center">
              Give a Review
            </h2>
            <br />
            <div className="w-full flex">
              <img
                src={`${selectedItem?.images[0]?.url}`}
                alt=""
                className="w-[80px] h-[80px]"
              />
              <div>
                <div className="pl-3 text-[20px]">{selectedItem?.name}</div>
                <h4 className="pl-3 text-[20px]">
                  INR₹{selectedItem?.discountPrice} x {selectedItem?.qty}
                </h4>
              </div>
            </div>

            <br />
            <br />

            <h5 className="pl-3 text-[20px] font-[500]">
              Give a Rating <span className="text-red-500">*</span>
            </h5>
            <div className="flex w-full ml-2 pt-1">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>
            <br />
            <div className="w-full ml-3">
              <label className="block text-[20px] font-[500]">
                Write a comment
                <span className="ml-1 font-[400] text-[16px] text-[#00000052]">
                  (optional)
                </span>
              </label>
              <textarea
                name="comment"
                cols="20"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your product? write your expression about it!"
                className="mt-2 w-[95%] border p-2 outline-none"
              ></textarea>
            </div>
            <div
              className={`${styles.button} text-white text-[20px] ml-3`}
              onClick={rating > 1 ? reviewHandler : null}
            >
              Submit
            </div>
          </div>
        </div>
      )}

      <div className="border-t w-full text-right">
        <h5 className="pt-3 text-[18px]">
          Total Price: <strong>INR₹{data?.totalPrice}</strong>
        </h5>
      </div>
      <br />
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Shipping Address:</h4>
          <h4 className="pt-3 text-[20px]">
            {data?.shippingAddress.address1 + " " + data?.shippingAddress.address2}
          </h4>
          <h4 className="text-[20px]">{data?.shippingAddress.country}</h4>
          <h4 className="text-[20px]">{data?.shippingAddress.city}</h4>
          <h4 className="text-[20px]">{data?.user?.phoneNumber}</h4>
        </div>
        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px]">Payment Info:</h4>
          <h4>
            Status: {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"}
          </h4>
          <br />
          {data?.status === "Delivered" && (
            <div className={`${styles.button} text-white`} onClick={refundHandler}>
              Give a Refund
            </div>
          )}
        </div>

<div className="bg-white p-4 rounded shadow">
{data?.trackingId && data?.courier && (
  <div className="w-full mt-6">
    <h4 className="text-[20px] font-[600] mb-2">Tracking Info</h4>
    <p className="text-[16px]">Courier: {data.courier}</p>
    <p className="text-[16px]">Tracking ID: {data.trackingId}</p>
    <a
      href={`https://${data.courier}.com/track?tracking_id=${data.trackingId}`}
      target="_blank"
      rel="noreferrer"
      className="text-blue-600 underline mt-2 inline-block"
    >
      Track Shipment
    </a>
  </div>
)}
</div>


      </div>
      <br />
      <button
        onClick={() => window.print()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 my-4"
      >
        Print Invoice
      </button>
      <Link to="/">
        <div className={`${styles.button} text-white`}>Send Message</div>
      </Link>
      <br />
      <br />
    </div>
  );
};

export default UserOrderDetails;
