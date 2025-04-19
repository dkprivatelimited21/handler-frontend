import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { categoriesData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (!term.trim()) {
      setSearchData(null);
      return;
    }

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );

    setSearchData(filteredProducts);
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Your browser does not support voice recognition.");
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setSearchTerm(voiceText);

      const filteredProducts =
        allProducts &&
        allProducts.filter((product) =>
          product.name.toLowerCase().includes(voiceText.toLowerCase())
        );

      setSearchData(filteredProducts);
    };

    recognition.start();
  };

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 70);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* ...Desktop content remains unchanged... */}

      {/* Mobile Header with Voice Search */}
      <div className={`${active ? "shadow-sm fixed top-0 left-0 z-10" : ""} w-full bg-white z-50 800px:hidden flex flex-col`}>
        <div className="flex items-center justify-between px-4 h-[60px]">
          <BiMenuAltLeft size={30} className="cursor-pointer" onClick={() => setOpen(true)} />
          <Link to="/">
            <h1 className="text-[25px] font-[600] capitalize text-[#3d3a3a]">local-handler</h1>
          </Link>
          <div className="relative" onClick={() => setOpenCart(true)}>
            <AiOutlineShoppingCart size={25} />
            <span className="absolute -right-1 -top-1 bg-[#3bc177] text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
              {cart && cart.length}
            </span>
          </div>
        </div>
        <div className="px-4 py-2">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
            />
            <AiOutlineSearch
              size={25}
              className="absolute right-8 top-[8px] text-gray-500 cursor-pointer"
              onClick={() => handleSearchChange({ target: { value: searchTerm } })}
            />
            <button
              onClick={handleVoiceSearch}
              className="absolute right-1 top-[5px] bg-blue-500 text-white text-xs px-2 py-[2px] rounded"
            >🎤</button>
          </div>
          {searchData && searchData.length > 0 && searchTerm.trim() !== "" && (
            <div className="absolute bg-white z-10 shadow w-full left-0 p-3">
              {searchData.map((i) => (
                <Link to={`/product/${i._id}`} key={i._id}>
                  <div className="flex items-center py-1">
                    <img
                      src={i?.images?.[0]?.url}
                      alt=""
                      className="w-[40px] h-[40px] mr-2"
                    />
                    <h5>{i.name}</h5>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ...Rest of the sidebar and content remains unchanged... */}

      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </>
  );
};

export default Header;
