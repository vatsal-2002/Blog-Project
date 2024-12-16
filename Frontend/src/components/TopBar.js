import React from "react";
import { Link } from "react-router-dom"; 

const TopBar = () => {
  const isAuthenticated = localStorage.getItem("token") ? true : false;

  return (
    <div className="top-bar">
      <div className="logo">
        <h1>BlogSite</h1>
      </div>
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <Link to="/write">Write</Link>
            <Link to="/dashboard">Dashboard</Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default TopBar;
