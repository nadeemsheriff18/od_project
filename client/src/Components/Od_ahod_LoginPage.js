import React from "react";
import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";

function Od_ahod_LoginPage() {
  
  const [cookies, setCookie, removeCookie] = useCookies(["Role"]);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  const history = useHistory();

  const viewLogin = (status) => {
    setIsLogin(status);
    setError(null);
    //hi
  };

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.detail) {
        setError(data.detail);
      } else {
        setCookie("Email", data.email);
        setCookie("AuthToken", data.token);
        setCookie("Role", data.role);
        

        if (data.role === "admin") {
          history.push("/admin");
        } else if (data.role === "student") {
          history.push("/student");
        } 
        else if (data.role === "ahod") {
            history.push("/ahod");
          } 
        else {
          setError("Invalid role detected.");
          removeCookie("Email");
          removeCookie("AuthToken");
          removeCookie("Role");
        }
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  

  return (
    <div className="min-h-screen bg-violet-100 flex flex-col items-center justify-center px-4">
      {/* Main Container */}
      <h1 className="mt-4 mb-9 text-3xl font-semibold text-purple-800 text-center">DEPARTMENT OF CSBS</h1>
      
      <form className="w-full max-w-md flex flex-col shadow-lg p-8 rounded-2xl bg-white">
        {/* Welcome Text */}
        <h1 className="flex justify-center items-center mb-9 text-2xl text-violet-800 font-bold">
          Welcome
        </h1>

        {/* Email Input */}
        <div className="mb-4">
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-purple-500 focus:border-purple-500 block w-full p-3"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <input
            placeholder="Password"
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-purple-500 focus:border-purple-500 block w-full p-3"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm Password for Sign Up */}
        {!isLogin && (
          <div className="mb-6">
            <input
              placeholder="Confirm Password"
              type="password"
              id="confirmPassword"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-purple-500 focus:border-purple-500 block w-full p-3"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="mb-6">
          <input
            type="submit"
            className="w-full text-lg border-2 rounded-xl p-3 bg-purple-500 text-white cursor-pointer hover:bg-purple-700 transition-all duration-300"
            value={isLogin ? "Login" : "Sign Up"}
            onClick={(e) => handleSubmit(e, isLogin ? "ahodlogin" : "ahodsignup")}
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Forgot Password */}
        <div className="flex justify-center mb-6">
          <Link to="/forgotpwd" className="text-purple-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Toggle between Login and Signup */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => viewLogin(false)}
            className={`w-full text-lg rounded-lg p-2 transition-all duration-300 mr-2 ${!isLogin ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          >
            Sign Up
          </button>
          <button
            onClick={() => viewLogin(true)}
            className={`w-full text-lg rounded-lg p-2 transition-all duration-300 ml-2 ${isLogin ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};


export default Od_ahod_LoginPage;
