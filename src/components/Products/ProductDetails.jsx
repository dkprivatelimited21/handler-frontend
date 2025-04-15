// Cleaned ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

const ProductDetails = () => {
  const { id } = useParams();
  const { products } = useSelector((state) => state.product);
  const data = products.find((item) => item._id === id);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }
    // Proceed to payment or add to cart logic here
    console.log("Buying", data.name, selectedSize, selectedColor);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!data) return <div className="p-6 text-red-600">Product not found</div>;

  return (
    <div className="p-6 w-full flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/2">
        <img
          src={data?.images[0]?.url || "/default-product.png"}
          alt={data.name}
          className="rounded-lg object-cover w-full max-h-[500px]"
        />
        <div className="flex gap-2 mt-4">
          {data.images.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt=""
              className="w-16 h-16 object-cover rounded border"
            />
          ))}
        </div>
      </div>

      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-semibold mb-2">{data.name}</h2>
        <p className="text-gray-600 mb-4">{data.description}</p>
        <p className="text-lg font-bold text-green-600 mb-2">₹{data.discountPrice}</p>
        <p className="text-sm line-through text-gray-400 mb-4">₹{data.originalPrice}</p>

        <div className="mb-4">
          <h4 className="font-medium mb-1">Select Size:</h4>
          <div className="flex gap-2">
            {data.sizes?.map((size) => (
              <button
                key={size}
                className={`px-3 py-1 border rounded-full ${
                  selectedSize === size ? "bg-black text-white" : "bg-gray-100"
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-1">Select Color:</h4>
          <div className="flex gap-2">
            {data.colors?.map((color) => (
              <div
                key={color}
                className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                  selectedColor === color ? "border-black" : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              ></div>
            ))}
          </div>
        </div>

        <button
          onClick={handleBuyNow}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Buy Now
        </button>
      </div>

      <div className="w-full mt-8">
        <h3 className="text-xl font-semibold mb-2">Product Reviews</h3>
        {data.reviews && data.reviews.length > 0 ? (
          <div className="space-y-4">
            {data.reviews.map((item, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={item?.user?.avatar?.url || "/default-avatar.png"}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium">Verified Customer</span>
                </div>
                <div className="flex gap-1 text-yellow-500">
                  {[...Array(item.rating)].map((_, i) => (
                    <AiFillStar key={i} />
                  ))}
                  {[...Array(5 - item.rating)].map((_, i) => (
                    <AiOutlineStar key={i} />
                  ))}
                </div>
                <p className="text-gray-600 mt-1 text-sm">{item.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;