import React from 'react'
import Header from "../components/Layout/Header";
import Hero from "../components/Route/Hero/Hero";
import Categories from "../components/Route/Categories/Categories";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Events from "../components/Events/Events";
import Sponsored from "../components/Route/Sponsored";
import Footer from "../components/Layout/Footer";
import CategoryGrid from "../components/Route/Categories/CategoryGrid"; // NEW

const HomePage = () => {
  return (
    <div>
      <Header activeHeading={1} />
      <Hero />
      <CategoryGrid /> {/* Replaces old Categories component */}
      <BestDeals />
      <Events />
      <FeaturedProduct />
      <Sponsored />
      <Footer />
    </div>
  );
};


export default HomePage