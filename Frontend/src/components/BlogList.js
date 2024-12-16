import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BlogList.css";

const BlogList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setMessage("Error fetching blogs");
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="blog-list">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {isLoading ? (
        <p>Loading blogs...</p>
      ) : (
        <div className="blogs">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div key={blog._id} className="blog-card">
                <h3>{blog.title || "Untitled Blog"}</h3>
                <p>{blog.shortDescription || "No description available."}</p>
                {blog.authorId && (
                  <div className="author-info">
                    <p><strong>Author:</strong> {blog.authorId.username}</p>
                    <p><strong>Email:</strong> {blog.authorId.email}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>{message || "No blogs found."}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BlogList;
