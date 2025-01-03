import React from "react";
import { Link } from "react-router-dom";

const TopBar = () => {
  const isAuthenticated = localStorage.getItem("token") ? true : false;

  return (
    <div className="top-bar flex justify-between items-center px-6 py-4 bg-blue-600 text-white shadow-lg">
      <div className="logo">
        <h1 className="text-2xl font-bold uppercase tracking-wider cursor-pointer">
          BlogSite
        </h1>
      </div>

      <div className="nav-links flex items-center space-x-6">
        {isAuthenticated ? (
          <>
            <Link
              to="/write"
              className="text-lg font-medium hover:text-gray-300 transition duration-300"
            >
              Write
            </Link>
            <Link
              to="/dashboard"
              className="text-lg font-medium hover:text-gray-300 transition duration-300"
            >
              Dashboard
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="text-lg font-medium py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-lg font-medium py-2 px-4 rounded-lg  hover:bg-blue-500 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-lg font-medium py-2 px-4 rounded-lg  hover:bg-blue-500 transition duration-300"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default TopBar;
