// ProductDetails.jsx - Reviews restricted to buyers only
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addTocart } from "../../redux/actions/cart";
import { server } from '../../server';
import { toast } from 'react-toastify';
import Loader from '../Layout/Loader';
import Ratings from '../Products/Ratings';
import {
  AiFillHeart,
  AiOutlineHeart,} from "react-icons/ai";
import styles from "../../styles/styles";


const ProductDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [canReview, setCanReview] = useState(false);
  const { cart, user } = useSelector((state) => ({
    cart: state.cart.cart,
    user: state.user.user,
  }));
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${server}/product/${id}`).then((res) => {
      setData(res.data.product);
      setReviews(res.data.product.reviews || []);
    });

    // Check if user has bought the product
    if (user?._id) {
      axios
        .get(`${server}/order/user/${user._id}`)
        .then((res) => {
          const hasBought = res.data.orders.some((order) =>
            order.cart.some((item) => item._id === id)
          );
          setCanReview(hasBought);
        })
        .catch(() => setCanReview(false));
    }
  }, [id, user]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error('Please select size and color');
      return;
    }

    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error('Item already in cart');
    } else {
      const cartData = {
        ...data,
        qty: quantity,
        selectedSize,
        selectedColor,
      };
      dispatch(addToCart(cartData));
      toast.success('Item added to cart');
    }
  };

  const handleAddToWishlist = () => {
    toast.success('Added to wishlist');
  };

  const handleReviewSubmit = () => {
    if (!newReview) return;
    setReviews((prev) => [...prev, { comment: newReview, date: new Date().toDateString() }]);
    setNewReview('');
    toast.success('Review submitted');
  };

  const incrementQuantity = () => {
    if (data.stock <= quantity) {
      toast.error('Product stock limited!');
    } else {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    const estimatedDate = new Date(today.setDate(today.getDate() + 7));
    return estimatedDate.toDateString();
  };

  return (
    <div className="w-full py-5">
      {data ? (
        <div className="w-[90%] md:w-[80%] m-auto block md:flex">
          <div className="w-full md:w-[50%]">
            <img
              src={`${server}${data.images && data.images[0]}`}
              alt=""
              className="w-[100%]"
            />
            <div className="flex items-center gap-2 mt-4">
              {data.sizes?.map((size, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSize(size)}
                  className={`border px-3 py-1 rounded ${
                    selectedSize === size ? 'bg-black text-white' : 'bg-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {data.colors?.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  className={`border px-3 py-1 rounded ${
                    selectedColor === color ? 'bg-black text-white' : 'bg-white'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full md:w-[50%] md:pl-10">
            <h1 className="text-2xl font-semibold flex items-center justify-between">
              {data.name}
              <button onClick={handleAddToWishlist} title="Add to Wishlist">
                <Heart className="w-6 h-6 text-gray-600 hover:text-red-500" />
              </button>
            </h1>
            <p className="mt-2 text-gray-700">{data.description}</p>
            <div className="mt-3">
              <Ratings rating={data.ratings} />
            </div>
            <h4 className="mt-4 text-xl font-bold text-red-600">
              ₹{data.discountPrice}
            </h4>
            <h5 className="line-through text-gray-500">
              ₹{data.originalPrice}
            </h5>

            <div className="flex items-center mt-4">
              <button onClick={decrementQuantity} className="border px-3 py-1">-</button>
              <span className="mx-4">{quantity}</span>
              <button onClick={incrementQuantity} className="border px-3 py-1">+</button>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-6 px-6 py-2 bg-black text-white rounded"
            >
              Add to Cart
            </button>

            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Category: <span className="text-black">{data.category}</span>
              </p>
              <p className="text-sm text-gray-500">
                Stock: <span className="text-black">{data.stock}</span>
              </p>
              <p className="text-sm text-green-700 mt-2">
                Estimated Delivery: <span className="font-semibold">{getEstimatedDeliveryDate()}</span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}

      {/* Reviews Section */}
      {data && (
        <div className="w-[90%] md:w-[80%] m-auto mt-10">
          <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
          <div className="space-y-3">
            {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
            {reviews.map((review, index) => (
              <div key={index} className="border p-3 rounded">
                <p>{review.comment}</p>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
            ))}
          </div>

          {canReview && (
            <div className="mt-4">
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Write your review here..."
              ></textarea>
              <button
                onClick={handleReviewSubmit}
                className="mt-2 px-4 py-1 bg-black text-white rounded"
              >
                Submit Review
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
