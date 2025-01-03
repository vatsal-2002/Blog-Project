import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const authorId = localStorage.getItem("authorId");

    if (authorId) {
      fetch(
        `http://localhost:5000/api/blog-details/private?authorId=${authorId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setBlogs(data);
          setLoading(false); 
        })
        .catch((error) => {
          console.error("Error fetching blogs:", error);
          setLoading(false);
        });
    } else {
      console.log("Author ID is missing from local storage.");
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/blog-details/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Error deleting blog:",
          errorData.message || errorData.error
        );
        alert("Error deleting blog. Please try again.");
        return;
      }

      setBlogs(blogs.filter((blog) => blog._id !== id));
      alert("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("An error occurred while deleting the blog.");
    }
  };

  const isAuthenticated = localStorage.getItem("token") ? true : false;

  return (
    <div className="dashboard p-8 bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen">
      {isAuthenticated ? (
        <>
          <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Your Blogs
          </h1>
          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-solid"></div>
              <p className="ml-4 text-lg font-medium text-gray-800">Loading...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogs.length > 0 ? (
                blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                  >
                    <img
                      src={`http://localhost:5000${blog.imageUrl}`}
                      alt={blog.title}
                      className="w-full h-56 object-cover rounded-t-2xl"
                    />
                    <div className="p-6">
                      <p className="text-sm text-gray-500 mb-2 text-start">
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </p>
                      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        {blog.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-6">
                        {blog.shortDescription}
                      </p>
                      <div className="flex justify-between items-center">
                        <button
                          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                          onClick={() => handleDelete(blog._id)}
                        >
                          Delete
                        </button>
                        <Link
                          to={`/edit/${blog._id}`}
                          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-lg text-gray-700 font-medium">
                  No blogs available.
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-xl text-gray-700 font-medium">
          You need to login to see your blogs.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
