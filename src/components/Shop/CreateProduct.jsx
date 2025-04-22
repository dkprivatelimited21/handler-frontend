import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression"; // Import the compression library

const categorySizeMap = {
  "Shirts - Men": ["S", "M", "L", "XL", "XXL"],
  "Pants - Men": ["28", "30", "32", "34", "36", "38"],
  "Shoes - Men": ["6", "7", "8", "9", "10", "11"],
  "Shirts - Women": ["S", "M", "L", "XL", "XXL"],
  "Pants - Women": ["28", "30", "32", "34", "36", "38"],
  "Shoes - Women": ["6", "7", "8", "9", "10", "11"],
  "Sarees": [],
};

const colorOptions = ["Red", "Blue", "Black", "White", "Green", "Yellow"];

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [loading, setLoading] = useState(false);

  const dynamicSizeOptions = categorySizeMap[category] || [];
  const hasSizeOptions = dynamicSizeOptions.length > 0;

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product created successfully!");
      navigate("/dashboard");
      window.location.reload();
    }
  }, [dispatch, error, success]);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    setImages([]); // Clear existing images in the state

    // Set up the options for the compression (you can adjust the maxSizeMB and maxWidthOrHeight based on your needs)
    const options = {
      maxSizeMB: 1, // Max file size in MB
      maxWidthOrHeight: 800, // Max width or height of the image
      useWebWorker: true, // Enable web worker for compression
    };

    // Loop through each file and compress it
    for (const file of files) {
      try {
        const compressedFile = await imageCompression(file, options);

        // Create a FileReader to preview the compressed image
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.readyState === 2) {
            setImages((old) => [...old, reader.result]); // Add compressed image to state
          }
        };
        reader.readAsDataURL(compressedFile); // Read the compressed file
      } catch (error) {
        console.error("Error compressing the image", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!seller?._id) {
      toast.error("Seller information not loaded.");
      return;
    }

    setLoading(true);

    try {
      await dispatch(
        createProduct({
          name,
          description,
          category,
          tags,
          originalPrice,
          discountPrice,
          stock,
          shopId: seller._id,
          images,
          ...(hasSizeOptions && {
            sizes: selectedSizes,
            colors: selectedColors,
          }),
        })
      );
    } catch (err) {
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Create Product</h5>
      <form onSubmit={handleSubmit}>
        <br />
        <div>
          <label className="pb-2">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            value={name}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your product name..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Description <span className="text-red-500">*</span></label>
          <textarea
            cols="30"
            required
            rows="8"
            name="description"
            value={description}
            className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter your product description..."
          ></textarea>
        </div>
        <br />
        <div>
          <label className="pb-2">Category <span className="text-red-500">*</span></label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Choose a category">Choose a category</option>
            {categoriesData && categoriesData.map((i) => (
              <option value={i.title} key={i.title}>{i.title}</option>
            ))}
          </select>
        </div>

        {hasSizeOptions && (
          <>
            <br />
            <div>
              <label className="pb-2 font-medium">Available Sizes</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {dynamicSizeOptions.map((size) => (
                  <label key={size} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      value={size}
                      checked={selectedSizes.includes(size)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectedSizes((prev) =>
                          checked ? [...prev, size] : prev.filter((s) => s !== size)
                        );
                      }}
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>
            <br />
            <div>
              <label className="pb-2 font-medium">Available Colors</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {colorOptions.map((color) => (
                  <label key={color} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      value={color}
                      checked={selectedColors.includes(color)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectedColors((prev) =>
                          checked ? [...prev, color] : prev.filter((c) => c !== color)
                        );
                      }}
                    />
                    {color}
                  </label>
                ))}
              </div>
            </div>
          </>
        )}

        <br />
        <div>
          <label className="pb-2">Tags</label>
          <input
            type="text"
            name="tags"
            value={tags}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setTags(e.target.value)}
            placeholder="Enter your product tags..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Original Price</label>
          <input
            type="number"
            name="price"
            value={originalPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setOriginalPrice(e.target.value)}
            placeholder="Enter your product price..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Price (With Discount) <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="price"
            value={discountPrice}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setDiscountPrice(e.target.value)}
            placeholder="Enter your product price with discount..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Product Stock <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="price"
            value={stock}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            onChange={(e) => setStock(e.target.value)}
            placeholder="Enter your product stock..."
          />
        </div>
        <br />
        <div>
          <label className="pb-2">Upload Images <span className="text-red-500">*</span></label>
          <input
            type="file"
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {images &&
              images.map((i) => (
                <img
                  src={i}
                  key={i}
                  alt=""
                  className="h-[120px] w-[120px] object-cover m-2"
                />
              ))}
          </div>
          <br />
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 text-center block w-full h-[40px] px-3 border border-gray-300 rounded-[3px] text-white font-medium ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mx-auto text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              "Create"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
