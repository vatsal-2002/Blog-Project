import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Write = () => {
  const [blogData, setBlogData] = useState({
    title: "",
    shortDescription: "",
    content: "",
    authorId: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogData((blogData) => ({
      ...blogData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const authorId = localStorage.getItem("authorId"); // Ensure this is correctly set

      const payload = {
        title: blogData.title,
        shortDescription: blogData.shortDescription,
        content: blogData.content,
        authorId,
      };

      const response = await axios.post("http://localhost:5000/api/blogs", payload);

      if (response.status === 201) {
        navigate("/dashboard");
      } else {
        console.error("Failed to create blog:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating blog:", error.message);
    }
  };

  return (
    <div className="write-blog">
      <h1>Add New Blog</h1>
      <input
        type="text"
        name="title"
        placeholder="Blog Title"
        value={blogData.title}
        onChange={handleInputChange}
        required
      />
      <textarea
        name="shortDescription"
        placeholder="Short Description"
        value={blogData.shortDescription}
        onChange={handleInputChange}
        required
      />
      <textarea
        name="content"
        placeholder="Main Content"
        value={blogData.content}
        onChange={handleInputChange}
        required
      />
      <button className="write-btn" onClick={handleSubmit}>Save</button>
    </div>
  );
};

export default Write;
