import React from 'react';

const Navbar = () => {
  return (
    <div className="flex items-center justify-between bg-[#f6d7fc] px-3 py-1 md:px-6">
      {/* Left: Logo */}
      <img
        src="./assets/rec.png"
        alt="REC Logo"
        className="w-32 h-32 md:w-32 md:h-32 lg:w-32 lg:h-32 object-contain" // Adjusted size and maintained aspect ratio
      />

      {/* Center: Heading */}
      <h3 className="absolute left-1/2 transform -translate-x-1/2 text-lg md:text-2xl lg:text-3xl font-bold text-gray-800">
        OD/Leave Request Application
      </h3>

      {/* Right: REC Heading */}
      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#8b0bb7]">
        REC
      </h3>
    </div>
  );
};

export default Navbar;
