import React, { useState, useEffect } from "react";
import { AiOutlineShoppingCart, AiFillHeart , AiOutlineHeart} from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getAllProductsShop } from "../../redux/actions/product";
import styles from "../../styles/styles";
import Ratings from "./Ratings";
import axios from "axios";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { server } from "../../server";

const ProductDetails = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { products } = useSelector((state) => state.products);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProductsShop(data && data?.shop._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist]);

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

 const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg =  totalRatings / totalReviewsLength || 0;

  const averageRating = avg.toFixed(2);


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
    <div className="bg-white">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={`${data && data.images[select]?.url}`}
                  alt=""
                  className="w-[80%]"
                />
                <div className="w-full flex">
                  {data &&
                    data.images.map((i, index) => (
                      <div
                        className={`${
                          select === 0 ? "border" : "null"
                        } cursor-pointer`}
                      >
                        <img
                          src={`${i?.url}`}
                          alt=""
                          className="h-[200px] overflow-hidden mr-3 mt-3"
                          onClick={() => setSelect(index)}
                        />
                      </div>
                    ))}
                  <div
                    className={`${
                      select === 1 ? "border" : "null"
                    } cursor-pointer`}
                  ></div>
                </div>
              </div>
              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <p>{data.description}</p>
                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data.discountPrice}$
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.originalPrice ? data.originalPrice + "$" : null}
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
