import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/private-blogs?authorId=" + localStorage.getItem("authorId"))
      .then((res) => res.json())
      .then((data) => setBlogs(data))
      .catch((error) => console.error("Error fetching blogs:", error));
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: "DELETE",
      });
      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const isAuthenticated = localStorage.getItem("token") ? true : false;

  return (
    <div className="dashboard">
      {isAuthenticated ? (
        <>
          <h1>Your Blogs</h1>
          <ul>
            {blogs.map((blog) => (
              <li key={blog._id}>
                <h2>{blog.title}</h2>
                <p>{blog.shortDescription}</p>
                <p>{blog.content}</p>
                <button onClick={() => handleDelete(blog._id)}>Delete</button>
                <Link to={`/edit/${blog._id}`}>Edit</Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>You need to login</>
      )}
    </div>
  );
};

export default Dashboard;
