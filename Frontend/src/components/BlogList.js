import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BlogList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/blog-details"
        );
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
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-wide mb-4 leading-tight">
            Blog List
          </h1>
        </div>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-6 py-3 w-full sm:w-96 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center space-x-2">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 border-solid"></div>
            <p className="text-xl text-gray-900">Loading blogs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4 tracking-wide">
                      {blog.title || "Untitled Blog"}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {blog.shortDescription || "No description available."}
                    </p>

                    {blog.imageUrl && (
                      <div className="mb-4">
                        <img
                          src={`http://localhost:5000${blog.imageUrl}`}
                          alt={blog.title}
                          className="w-full h-48 object-cover rounded-lg shadow-md transition-all duration-300 hover:scale-105"
                        />
                      </div>
                    )}

                    {blog.author && (
                      <div className="text-gray-700 text-sm mb-4">
                        <p>
                          <strong className="font-semibold">Author:</strong>{" "}
                          {blog.author.username}
                        </p>
                        <p>
                          <strong className="font-semibold">Email:</strong>{" "}
                          {blog.author.email}
                        </p>
                      </div>
                    )}

                    <div className="text-right mt-4">
                      <Link
                        to={`/preview/${blog._id}`}
                        className="text-indigo-600 font-semibold flex items-center gap-1 hover:text-indigo-800 transition-colors"
                      >
                        Read More
                        <span className="ml-1">⟶</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xl text-gray-900">
                {message || "No blogs found."}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
