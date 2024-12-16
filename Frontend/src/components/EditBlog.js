import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState({
    title: "",
    shortDescription: "",
    content: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/blogs/${id}`);
        if (!response.ok) throw new Error("Failed to fetch blog data");
        const data = await response.json();
        setBlogData({
          title: data.title || "",
          shortDescription: data.shortDescription || "",
          content: data.content || "",
        });
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });
      if (!response.ok) throw new Error("Failed to update blog");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="edit-blog">
      <h1>Edit Blog</h1>
      <input
        type="text"
        name="title"
        placeholder="Blog Title"
        value={blogData.title}
        onChange={handleInputChange}
      />
      <textarea
        name="shortDescription"
        placeholder="Short Description"
        value={blogData.shortDescription}
        onChange={handleInputChange}
      />
      <textarea
        name="content"
        placeholder="Main Content"
        value={blogData.content}
        onChange={handleInputChange}
      />
      <button onClick={handleSubmit}>Save Changes</button>
    </div>
  );
};

export default EditBlog;
