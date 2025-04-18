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
      {/* Desktop Header */}
      <div className={`${styles.section} hidden 800px:block`}>
        <div className="h-[50px] my-[20px] flex items-center justify-between">
          <div>
            <Link to="/">
              <h1 className="text-[25px] leading-[1.2] 800px:text-[50px] text-[#3d3a3a] font-[600] capitalize">
                local-handler
              </h1>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="w-[50%] relative">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            />
            {searchData && searchData.length > 0 && searchTerm.trim() !== "" && (
              <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4 w-full left-0">
                {searchData.map((i) => (
                  <Link to={`/product/${i._id}`} key={i._id}>
                    <div className="w-full flex items-center py-2">
                      <img
                        src={`${i.images[0]?.url}`}
                        alt=""
                        className="w-[40px] h-[40px] mr-[10px]"
                      />
                      <h1>{i.name}</h1>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className={`${styles.button}`}>
            <Link to={`${isSeller ? "/dashboard" : "/shop-create"}`}>
              <h1 className="text-[#fff] flex items-center">
                {isSeller ? "Go Dashboard" : "Become Seller"}
                <IoIosArrowForward className="ml-1" />
              </h1>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div
        className={`$${
          active ? "shadow-sm fixed top-0 left-0 z-10" : ""
        } transition hidden 800px:flex items-center justify-between w-full bg-[#3321c8] h-[70px]`}
      >
        <div className={`${styles.section} relative ${styles.noramlFlex} justify-between`}>
          <div onClick={() => setDropDown(!dropDown)}>
            <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
              <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
              <button className="h-full w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md">
                All Categories
              </button>
              <IoIosArrowDown
                size={20}
                className="absolute right-2 top-4 cursor-pointer"
              />
              {dropDown && (
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              )}
            </div>
          </div>

          <div className={`${styles.noramlFlex}`}>
            <Navbar active={activeHeading} />
          </div>

          <div className="flex">
            {/* Wishlist */}
            <div className="relative cursor-pointer mr-[15px]" onClick={() => setOpenWishlist(true)}>
              <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
              <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 text-white text-[12px] text-center">
                {wishlist && wishlist.length}
              </span>
            </div>

            {/* Cart */}
            <div className="relative cursor-pointer mr-[15px]" onClick={() => setOpenCart(true)}>
              <AiOutlineShoppingCart size={30} color="rgb(255 255 255 / 83%)" />
              <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 text-white text-[12px] text-center">
                {cart && cart.length}
              </span>
            </div>

            {/* Profile */}
            <div className="relative cursor-pointer mr-[15px]">
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={user?.avatar?.[0]?.url || "/default-avatar.png"}
                    className="w-[35px] h-[35px] rounded-full"
                    alt="profile"
                  />
                </Link>
              ) : (
                <Link to="/login">
                  <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Header (unchanged) */}
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
              className="absolute right-2 top-[8px] text-gray-500 cursor-pointer"
              onClick={() => handleSearchChange({ target: { value: searchTerm } })}
            />
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

      {/* Mobile Sidebar */}
      {open && (
        <div className="fixed w-full h-full bg-[#0000005f] z-50 top-0 left-0">
          <div className="fixed w-[70%] bg-white h-full top-0 left-0 z-50 p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Menu</h2>
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <Navbar active={activeHeading} />
            <div className="mt-4">
              <Link
                to="/shop-create"
                className="bg-blue-600 text-white px-4 py-2 rounded-md inline-block"
                onClick={() => setOpen(false)}
              >
                Become Seller
              </Link>
            </div>
            <div className="flex justify-center mt-4">
              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src={user?.avatar?.[0]?.url || "/default-avatar.png"}
                    className="w-[50px] h-[50px] rounded-full border-2 border-[#0eae88]"
                    alt="profile"
                  />
                </Link>
              ) : (
                <div className="text-center">
                  <Link to="/login" className="text-[18px] text-[#000000b7] pr-2">Login /</Link>
                  <Link to="/sign-up" className="text-[18px] text-[#000000b7]">Sign up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </>
  );
};

export default Header;
