import React from "react";
import { Link } from "react-router-dom";
function Odheader() {
  return (
    <div className="flex justify-between items-center bg-violet-100 drop-shadow-xl min-h-24 pl-40 pr-40 pt-2 absolute w-full">
      <img src="./assets/rec.png" className="w-1/5 h-1/5" alt="REC" />
      <div className="flex gap-3 ">
             <Link to="/"><button className="bg-purple-500 p-2 rounded-xl font-sans font-bold">STUDENT</button></Link>
             <Link to="/stafflogin"><button className="bg-purple-500 p-2 rounded-xl font-sans font-bold">STAFF</button></Link>
      </div>
    </div>
  );
}

export default Odheader;
