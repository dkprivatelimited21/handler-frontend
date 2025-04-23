import React, { useState, useEffect } from "react";
import { AiOutlineShoppingCart, AiFillHeart , AiOutlineHeart} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTocart } from "../../../redux/actions/cart";
import styles from "../../../styles/styles";

const ProductDetails = ({ data }) => {
  const { cart } = useSelector((state) => state);
  const [count, setCount] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to calculate the estimated delivery date (between 7 and 9 days)
  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 3) + 7; // Random number between 7 and 9
    today.setDate(today.getDate() + randomDays);
    return today.toLocaleDateString(); // Format the date to a readable string
  };

  // Add item to cart with size/color checks
  const addToCartHandler = (id) => {
    if (cart && cart.find((i) => i._id === id)) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < count) {
        toast.error("Product stock limited!");
      } else {
        if (data.sizes?.length > 0 && !selectedSize) {
          toast.error("Please select a size.");
          return;
        }

        if (data.colors?.length > 0 && !selectedColor) {
          toast.error("Please select a color.");
          return;
        }

        const cartData = {
          ...data,
          qty: count,
          selectedSize,
          selectedColor,
        };

        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  return (
    <div className="w-full sm:w-[80%] mx-auto">
      <div className="flex">
        <div className="w-full sm:w-[50%] pr-4">
          <img
            src={data?.images[0]?.url}
            alt={data?.name}
            className="w-full h-[350px] object-cover"
          />
        </div>
        <div className="w-full sm:w-[50%] pl-4">
          <h1 className={`${styles.productTitle} text-[22px]`}>{data?.name}</h1>
          <p className="py-2">{data?.description}</p>

          <div className="flex">
            <h4 className={`${styles.productDiscountPrice}`}>
              {data.discountPrice}$
            </h4>
            <h3 className={`${styles.price}`}>
              {data.originalPrice ? data.originalPrice + "₹" : null}
            </h3>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            Estimated Delivery: {getEstimatedDeliveryDate()}
          </div>

          {/* Size and Color Selection */}
          {data.sizes?.length > 0 && (
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-[200px] mt-3 border h-[35px] rounded-[5px]"
            >
              <option value="">Select Size</option>
              {data.sizes.map((size, i) => (
                <option key={i} value={size}>
                  {size}
                </option>
              ))}
            </select>
          )}

          {data.colors?.length > 0 && (
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-[200px] mt-3 border h-[35px] rounded-[5px]"
            >
              <option value="">Select Color</option>
              {data.colors.map((color, i) => (
                <option key={i} value={color}>
                  {color}
                </option>
              ))}
            </select>
          )}

          <div className="mt-5 flex items-center justify-between">
            <button
              className="bg-blue-500 text-white py-2 px-6 rounded"
              onClick={() => addToCartHandler(data?._id)}
            >
              Add to Cart
            </button>
            <button
              className="bg-green-500 text-white py-2 px-6 rounded"
              onClick={() => addToCartHandler(data?._id)}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
