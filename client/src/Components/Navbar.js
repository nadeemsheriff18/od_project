import React from 'react';

const Navbar = () => {
  return (
    <div className="flex items-center justify-between bg-[#f6d7fc] px-6 shadow-md">
      {/* Left: Logo */}
      <img
        src="./assets/rec.png"
        alt="REC Logo"
        className="w-28 h-28 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain" // Adjust size dynamically
      />

      {/* Center: Heading */}
      <h3 className="text-center text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
        OD/Leave Request Application
      </h3>

      {/* Right: REC Heading */}
      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-[#8b0bb7]">
        REC
      </h3>
    </div>
  );
};

export default Navbar;
