import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useCookies } from "react-cookie";

function LoginPage({ role, loginEndpoint, redirectPath }) {
  const [cookies, setCookie, removeCookie] = useCookies(["Role"]);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(loginEndpoint, {
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

        history.push(redirectPath);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-violet-100 flex flex-col items-center justify-center px-4">
      <h1 className="mt-4 mb-9 text-3xl font-semibold text-purple-800 text-center">
        DEPARTMENT OF CSBS
      </h1>

      <form className="w-full max-w-md flex flex-col shadow-lg p-8 rounded-2xl bg-white">
        <h1 className="flex justify-center items-center mb-9 text-2xl text-violet-800 font-bold">
          Welcome {role}
        </h1>

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

        <div className="mb-6">
          <input
            type="submit"
            className="w-full text-lg border-2 rounded-xl p-3 bg-purple-500 text-white cursor-pointer hover:bg-purple-700 transition-all duration-300"
            value="Login"
            onClick={handleSubmit}
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="flex justify-center mb-6">
          <Link to="/forgotpwd" className="text-purple-500 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
