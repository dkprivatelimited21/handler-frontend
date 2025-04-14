import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Country, State } from "country-state-city";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";

const Checkout = () => {
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const shipping = subTotalPrice > 1000 ? 0 : 100;
  const discountPercentage = 0; // You can fetch this from coupon logic
  const discountPrice = (subTotalPrice * discountPercentage) / 100;
  const totalPrice = subTotalPrice + shipping - discountPrice;

  const paymentSubmit = () => {
    if (address1 === "" || zipCode === null || country === "" || state === "") {
      toast.error("Please choose your delivery address!");
    } else {
      navigate("/payment");
    }
  };

  const autofillFromLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();
        setZipCode(data.address.postcode || "");
        setAddress1(
          `${data.address.road || ""} ${data.address.suburb || ""}`.trim()
        );
        setCountry(data.address.country || "");
        setState(data.address.state || "");
        toast.success("Location autofilled successfully!");
      } catch (error) {
        toast.error("Failed to fetch location.");
      }
    });
  };

  return (
    <div className="w-full flex flex-col-reverse 800px:flex-row py-10">
      <div className="w-full 800px:w-[65%]">
        <ShippingInfo
          user={user}
          country={country}
          setCountry={setCountry}
          state={state}
          setState={setState}
          address1={address1}
          setAddress1={setAddress1}
          address2={address2}
          setAddress2={setAddress2}
          zipCode={zipCode}
          setZipCode={setZipCode}
          autofillFromLocation={autofillFromLocation}
        />
      </div>
      <div className="w-full 800px:w-[35%]">
        <CartData
          totalPrice={totalPrice}
          subTotalPrice={subTotalPrice}
          shipping={shipping}
          discountPrice={discountPrice}
          paymentSubmit={paymentSubmit}
        />
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  state,
  setState,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
  autofillFromLocation,
}) => {
  return (
    <div className="w-full">
      <div className="mb-4">
        <button
          onClick={autofillFromLocation}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📍 Use My Location
        </button>
      </div>
      <form className="w-full">
        <div className="w-full flex pb-3">
          <input
            type="text"
            className="input"
            placeholder="Address 1"
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            required
          />
          <input
            type="text"
            className="input ml-2"
            placeholder="Address 2"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
          />
        </div>
        <div className="w-full flex pb-3">
          <input
            type="text"
            className="input"
            placeholder="Zip Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            required
          />
        </div>
        <div className="w-full flex pb-3">
          <select
            className="input"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          >
            <option value="">Choose Country</option>
            {Country &&
              Country.getAllCountries().map((item) => (
                <option key={item.isoCode} value={item.name}>
                  {item.name}
                </option>
              ))}
          </select>
          <select
            className="input ml-2"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          >
            <option value="">Choose State</option>
            {State &&
              State.getStatesOfCountry("IN").map((item) => (
                <option key={item.isoCode} value={item.name}>
                  {item.name}
                </option>
              ))}
          </select>
        </div>
      </form>
    </div>
  );
};

const CartData = ({ totalPrice, subTotalPrice, shipping, discountPrice, paymentSubmit }) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 shadow-sm">
      <h2 className="text-[20px] font-[600] pb-3">Cart Summary</h2>
      <div className="flex justify-between py-2">
        <h5 className="text-[18px]">Subtotal:</h5>
        <h5 className="text-[18px] font-[600]">₹{subTotalPrice}</h5>
      </div>
      <div className="flex justify-between py-2">
        <h5 className="text-[18px]">Shipping:</h5>
        <h5 className="text-[18px] font-[600]">₹{shipping}</h5>
      </div>
      <div className="flex justify-between py-2">
        <h5 className="text-[18px]">Discount:</h5>
        <h5 className="text-[18px] font-[600]">- ₹{discountPrice}</h5>
      </div>
      <div className="flex justify-between border-t pt-3 mt-3">
        <h5 className="text-[20px] font-[700]">Total:</h5>
        <h5 className="text-[20px] font-[700] text-green-600">₹{totalPrice}</h5>
      </div>
      <button
        onClick={paymentSubmit}
        className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default Checkout;
