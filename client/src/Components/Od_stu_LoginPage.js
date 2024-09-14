import React from "react";
import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";

function Od_stu_LoginPage() {
  
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
        

        if (data.role === "student") {
          history.push("/student");
        } else if (data.role === "admin") {
          history.push("/admin");
        } else {
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
    <div className="min-h-screen bg-violet-100 flex flex-col items-center justify-center">
      <h1 className="mt-2 mb-9 text-3xl font-semibold">DEPARTMENT OF CSBS</h1>
      <form className="w-full max-w-md flex flex-col shadow-2xl min-h-80 p-5 rounded-2xl bg-white">
        <h1 className="flex justify-center items-center mb-9 text-2xl text-violet-800 font-bold">
          Welcome
        </h1>

        <div className="mb-4 z-10">
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-8 z-10">
          <input
            placeholder="Password"
            type="password"
            id="password"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <input
              placeholder="Confirm Password"
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <input
            type="submit"
            className="placeholder:text-center text-lg border-2 rounded-xl p-1 bg-purple-300 cursor-pointer hover:bg-purple-700"
            onClick={(e) =>
              handleSubmit(e, isLogin ? "studentlogin" : "studentsignup")
            }
          />
          {error && <p>{error}</p>}
        </div>
        <div>
          <Link to="/forgotpwd">
            <button>Forgot Password</button>
          </Link>
        </div>

        <div className="flex mt-12 mx-2 gap-2">
          <button
            onClick={() => viewLogin(false)}
            className="text-xl rounded-lg p-2"
            style={{ backgroundColor: !isLogin ? "#07A417" : "rgb(188,188,188)" }}
          >
            Sign Up
          </button>
          <button
            onClick={() => viewLogin(true)}
            className="text-xl rounded-lg p-2"
            style={{ backgroundColor: isLogin ? "#07A417" : "rgb(188,188,188)" }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Od_stu_LoginPage;
