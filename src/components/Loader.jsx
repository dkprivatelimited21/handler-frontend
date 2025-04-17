import React from "react";

const Loader = () => {
  return (
    <div className="w-full h-[50vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
