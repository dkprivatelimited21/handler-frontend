import React from "react";
import { categoriesData } from "../../../static/data"; // adjust path as needed
import { Link } from "react-router-dom";

const CategoryGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {categoriesData.map((category) => (
        <Link
  to={`/products?category=${category.title}`}
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  key={category.id}
>

          <div className="relative group rounded-lg overflow-hidden shadow-md cursor-pointer">
            <img
              src={category.image_Url}
              alt={category.title}
              className="w-full h-40 object-cover transform group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white text-lg font-semibold text-center px-2">
                {category.title}
              </h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
