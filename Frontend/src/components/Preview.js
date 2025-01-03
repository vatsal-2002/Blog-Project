import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import leftQuote from "../assets/left-quote.svg";
import axios from "axios";

const Preview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/blog-details/${id}`
        );
        setBlog(response.data);
        setLoading(false);
      } catch (err) {
        setError("Blog not found or error fetching data.");
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleClose = () => {
    navigate("/");
  };

  if (loading) {
    return <div className="text-center text-lg font-medium">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-lg font-medium text-red-500">
        {error}
      </div>
    );
  }

  let titleCounter = 1;

  return (
    <div className="p-6 max-w-screen-xl mx-auto font-sans relative">
      <button
        onClick={handleClose}
        className="absolute top-6 right-4 text-4xl text-gray-600 hover:text-red-500"
        aria-label="Close"
      >
        &times;
      </button>

      {blog ? (
        <div>
          <h1 className="text-4xl font-bold text-left mb-6">{blog.title}</h1>

          {blog.imageUrl && (
            <div className="mb-4 flex items-center space-x-6">
              <div className="flex-shrink-0 w-1/2">
                <img
                  src={`http://localhost:5000${blog.imageUrl}`}
                  alt="Blog"
                  className="w-full h-[480px] object-contain rounded-lg"
                />
              </div>
            </div>
          )}
          <p className="text-lg text-gray-600 mb-6">{blog.shortDescription}</p>

          <div>
            {blog.dropdown.map((item, index) => {
              return (
                <div key={index} className="mb-8">
                  {item.selectedType === "Left and Right Content" && (
                    <div className="flex space-x-6">
                      <div className="w-1/2">
                        <p>{item.fields.leftContent}</p>
                      </div>
                      <div className="w-1/2">
                        <p>{item.fields.rightContent}</p>
                      </div>
                    </div>
                  )}

                  {item.selectedType === "Single Image" &&
                    item.fields.singleImage && (
                      <div className="mb-6">
                        <img
                          src={`http://localhost:5000${item.fields.singleImage}`}
                          alt="Single Content"
                          className="w-82 h-auto object-cover rounded-lg"
                        />
                      </div>
                    )}

                  {item.selectedType === "Double Image" &&
                    item.fields.leftImage &&
                    item.fields.rightImage && (
                      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col items-center">
                          <img
                            src={`http://localhost:5000${item.fields.leftImage}`}
                            alt="Left Image"
                            className="w-full h-[350px] object-cover rounded-lg shadow-lg"
                          />
                        </div>
                        <div className="flex flex-col items-center">
                          <img
                            src={`http://localhost:5000${item.fields.rightImage}`}
                            alt="Right Image"
                            className="w-full h-[350px] object-cover rounded-lg shadow-lg"
                          />
                        </div>
                      </div>
                    )}

                  {item.selectedType === "Quote" && item.fields.quote && (
                    <div className="mb-6">
                      <blockquote className="text-[#1D1D1D] italic p-6 flex items-center border-l-4 border-gray-400 pl-6 bg-gray-100 rounded-lg shadow-md">
                        <img
                          src={leftQuote}
                          alt="Left Quote"
                          className="w-8 h-8 mr-4"
                        />
                        <p className="flex-1">
                          {item.fields.quote.replace(/^"|"|"|"$/g, "")}
                        </p>
                      </blockquote>
                    </div>
                  )}

                  {item.selectedType === "Title" && item.fields.title && (
                    <div className="mb-4">
                      <h4 className="text-xl font-semibold text-gray-800">
                        {titleCounter++}. {item.fields.title}
                      </h4>
                    </div>
                  )}

                  {item.selectedType === "Description" &&
                    item.fields.description && (
                      <div className="mb-6">
                        <p className="text-gray-600">
                          {item.fields.description}
                        </p>
                      </div>
                    )}

                  {item.selectedType === "Point" &&
                    item.fields.points &&
                    item.fields.points.length > 0 && (
                      <div className="mb-6">
                        <ul className="list-disc pl-6 space-y-2 text-lg text-gray-700">
                          {item.fields.points.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {item.selectedType === "Embed Link" &&
                    item.fields.embedLink && (
                      <div className="mb-6">
                        <a
                          href={item.fields.embedLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline transition duration-300"
                        >
                          {item.fields.embedLink}
                        </a>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center text-lg">No blog found</div>
      )}
    </div>
  );
};

export default Preview;
