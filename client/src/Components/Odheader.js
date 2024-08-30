import React from "react";

function Odheader() {
  return (
    <div className="flex justify-between items-center bg-violet-100 drop-shadow-xl min-h-24 px-40 py-3 absolute w-full">
      <img src="./assets/rec.png" alt="REC" className="w-1/5 h-1/5" />
      <h3 className="text-3xl font-sans font-bold">REC</h3>
    </div>
  );
}

export default Odheader;
