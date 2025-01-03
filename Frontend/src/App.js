import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar";
import BlogList from "./components/BlogList";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import EditBlog from "./components/EditBlog";
import Write from "./components/Write";
import Preview from "./components/Preview";
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <TopBar />
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/edit/:id" element={<EditBlog />} />
          <Route path="/write" element={<Write />} />
          <Route path="/preview/:id" element={<Preview />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
