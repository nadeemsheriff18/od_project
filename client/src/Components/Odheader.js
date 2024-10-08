import React from "react";

function Odheader() {
  return (
    <div className="flex justify-between items-center bg-violet-100 drop-shadow-xl min-h-24 px-4 md:px-40 pt-2 sticky w-full">
      <img src="./assets/rec.png" className="w-1/4 h-auto md:w-1/5" alt="REC" />
      <h2 className="text-2xl md:text-3xl font-bold font-mono">CSBS</h2>
    </div>
  );
}

export default Odheader;
