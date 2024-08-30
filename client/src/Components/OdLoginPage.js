import React from "react";

function OdLoginPage() {

  
  return (
    <>
      <div className="min-h-screen bg-violet-100 flex flex-col items-center justify-center">
        <h1 className="mt-2 mb-9 text-3xl font-semibold">DEPARTMENT OF CSBS</h1>
        <form className="w-full max-w-md flex flex-col shadow-2xl min-h-80 p-5 rounded-2xl bg-white">
          {/* <div className="absolute inset-1 flex items-center justify-center ">
          <h1 className="text-8xl pt-7 font-semibold text-violet-400">REC</h1>
        </div> */}

          <h1 className="flex justify-center items-center mb-9 text-2xl text-violet-800 font-bold">
            Welcome
          </h1>

          <div className="mb-4 z-10">
            {/* <label
            for="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label> */}
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-xl"
              placeholder="Email"
              required
            />
          </div>
          <div className="flex flex-col gap-3 mb-8 z-10">
            {/* <label
            for="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" 
          >
            Your password
          </label> */}
            <input
              placeholder="Password"
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-xl"
              required
            />
            
          </div>
          
          {/* <div className="flex items-start mb-5">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              required
            />
          </div>
          <label
            for="remember"
            className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Remember me
          </label>
        </div> */}
          <button
            type="submit"
            className="text-white  z-10 bg-violet-800 hover:bg-violet-900 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-fit px-5 py-2.5 text-center dark:bg-violet-800 dark:hover:bg-violet-900 dark:focus:ring-violet-800 mx-auto shadow-lg"
          >
            SignUp
          </button>
        </form>
      </div>
    </>
  );
}

export default OdLoginPage;
