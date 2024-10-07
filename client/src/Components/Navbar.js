import React from 'react'

const Navbar = () => {
  return (
    <div className='flex items-center justify-between bg-[#f6d7fc] px-4 py-2 md:px-8'>
      <img 
        src='./assets/rec.png' 
        alt="rec logo" 
        className='w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32'  // Adjust logo size based on screen size
      />
      <h3 className='font-bold text-xl md:text-2xl lg:text-3xl font-sans text-[#fdfdfd]'>
        REC
      </h3>
    </div>
  )
}

export default Navbar;
