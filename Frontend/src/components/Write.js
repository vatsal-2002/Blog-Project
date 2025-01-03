import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";

const Write = () => {
  const [blogData, setBlogData] = useState({
    title: "",
    shortDescription: "",
    image: null,
    authorId: "",
  });
  const navigate = useNavigate();

  const [dropdowns, setDropdowns] = useState([]);

  const typeOptions = [
    "select Type",
    "Left and Right Content",
    "Single Image",
    "Double Image",
    "Quote",
    "Title",
    "Description",
    "Point",
    "Embed Link",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddDropdown = () => {
    setDropdowns((prevDropdowns) => [
      ...prevDropdowns,
      {
        id: prevDropdowns.length,
        selectedType: "",
        fields: {},
        showDropdown: true,
      },
    ]);
  };

  const handleTypeChange = (e, index) => {
    const newType = e.target.value;
    const updatedDropdowns = [...dropdowns];
    updatedDropdowns[index] = {
      ...updatedDropdowns[index],
      selectedType: newType,
      fields: {},
    };
    setDropdowns(updatedDropdowns);
  };

  const handleFieldChange = (index, field, value) => {
    const updatedDropdowns = [...dropdowns];
    if (value instanceof File) {
      updatedDropdowns[index].fields[field] = value;
    } else {
      updatedDropdowns[index].fields[field] = value;
    }
    setDropdowns(updatedDropdowns);
  };

  const handlePointChange = (index, e) => {
    const newPoint = e.target.value;
    const updatedDropdowns = [...dropdowns];
    updatedDropdowns[index] = {
      ...updatedDropdowns[index],
      fields: { ...updatedDropdowns[index].fields, newPoint },
    };
    setDropdowns(updatedDropdowns);
  };

  const addPoint = (index) => {
    const updatedDropdowns = [...dropdowns];
    const points = updatedDropdowns[index].fields.points || [];
    updatedDropdowns[index] = {
      ...updatedDropdowns[index],
      fields: {
        ...updatedDropdowns[index].fields,
        points: [...points, updatedDropdowns[index].fields.newPoint],
      },
    };
    setDropdowns(updatedDropdowns);
  };

  const handleDeleteDropdown = (index) => {
    const updatedDropdowns = dropdowns.filter((_, idx) => idx !== index);
    setDropdowns(updatedDropdowns);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlogData((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const authorId = localStorage.getItem("authorId");

      const formData = new FormData();
      formData.append("title", blogData.title);
      formData.append("shortDescription", blogData.shortDescription);
      formData.append("authorId", authorId);

      if (blogData.image) {
        formData.append("image", blogData.image);
      }

      dropdowns.forEach((dropdown, index) => {
        formData.append(
          `dropdown[${index}][selectedType]`,
          dropdown.selectedType
        );

        Object.entries(dropdown.fields).forEach(([key, value]) => {
          if (key !== "points" && typeof value === "string") {
            formData.append(`dropdown[${index}][fields][${key}]`, value);
          }
        });

        if (dropdown.fields.points) {
          dropdown.fields.points.forEach((point, pointIndex) => {
            formData.append(
              `dropdown[${index}][fields][points][${pointIndex}]`,
              point
            );
          });
        }

        if (dropdown.fields.singleImage) {
          formData.append(`singleImage`, dropdown.fields.singleImage);
        }
        if (dropdown.fields.leftImage) {
          formData.append(`leftImage`, dropdown.fields.leftImage);
        }
        if (dropdown.fields.rightImage) {
          formData.append(`rightImage`, dropdown.fields.rightImage);
        }
      });

      const response = await axios.post(
        "http://localhost:5000/api/blog-details",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Add New Blog</h1>
        <button
          type="button"
          onClick={handleAddDropdown}
          className="inline-block bg-purple-600 text-white py-3 px-8 rounded-md hover:bg-purple-700 transition"
        >
          Add New Blog Section
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            value={blogData.title}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <textarea
            name="shortDescription"
            placeholder="Short Description"
            value={blogData.shortDescription}
            onChange={handleInputChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {dropdowns.map((dropdown, index) => (
          <div key={dropdown.id} className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="w-full">
                {dropdown.showDropdown && (
                  <div className="space-y-1">
                    <label
                      htmlFor={`type-${dropdown.id}`}
                      className="block font-semibold"
                    >
                      Select Type
                    </label>
                    <select
                      id={`type-${dropdown.id}`}
                      value={dropdown.selectedType}
                      onChange={(e) => handleTypeChange(e, index)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      {typeOptions.map((type, idx) => (
                        <option key={idx} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDeleteDropdown(index)}
                className="ml-2 text-red-500 mt-6"
              >
                <FaTrashAlt />
              </button>
            </div>

            {dropdown.selectedType === "Left and Right Content" && (
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor={`leftContent-${dropdown.id}`}
                    className="block font-semibold mb-2"
                  >
                    Left Content
                  </label>
                  <textarea
                    id={`leftContent-${dropdown.id}`}
                    value={dropdown.fields.leftContent || ""}
                    onChange={(e) =>
                      handleFieldChange(index, "leftContent", e.target.value)
                    }
                    placeholder="Enter content for the left section"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor={`rightContent-${dropdown.id}`}
                    className="block font-semibold mb-2"
                  >
                    Right Content
                  </label>
                  <textarea
                    id={`rightContent-${dropdown.id}`}
                    value={dropdown.fields.rightContent || ""}
                    onChange={(e) =>
                      handleFieldChange(index, "rightContent", e.target.value)
                    }
                    placeholder="Enter content for the right section"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {dropdown.selectedType === "Single Image" && (
              <div>
                <label
                  htmlFor={`singleImage-${dropdown.id}`}
                  className="block font-semibold"
                >
                  Upload Single Image
                </label>
                <input
                  type="file"
                  id={`singleImage-${dropdown.id}`}
                  accept="image/*"
                  onChange={(e) =>
                    handleFieldChange(index, "singleImage", e.target.files[0])
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {dropdown.selectedType === "Double Image" && (
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="block font-semibold">Left Image</label>
                  <input
                    type="file"
                    name="leftImage"
                    accept="image/*"
                    onChange={(e) =>
                      handleFieldChange(index, "leftImage", e.target.files[0])
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-semibold">Right Image</label>
                  <input
                    type="file"
                    name="rightImage"
                    accept="image/*"
                    onChange={(e) =>
                      handleFieldChange(index, "rightImage", e.target.files[0])
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {dropdown.selectedType === "Quote" && (
              <div className="space-y-2">
                <label
                  htmlFor={`quote-${dropdown.id}`}
                  className="block font-semibold"
                >
                  Enter Quote
                </label>
                <input
                  type="text"
                  id={`quote-${dropdown.id}`}
                  value={dropdown.fields.quote || '"" ""'}
                  onChange={(e) =>
                    handleFieldChange(index, "quote", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {dropdown.selectedType === "Title" && (
              <div className="space-y-1">
                <label
                  htmlFor={`titleField-${dropdown.id}`}
                  className="block font-semibold"
                >
                  Enter Title
                </label>
                <input
                  type="text"
                  id={`titleField-${dropdown.id}`}
                  value={dropdown.fields.title || ""}
                  onChange={(e) =>
                    handleFieldChange(index, "title", e.target.value)
                  }
                  placeholder="Enter the title here"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {dropdown.selectedType === "Description" && (
              <div>
                <label
                  htmlFor={`description-${dropdown.id}`}
                  className="block font-semibold"
                >
                  Description
                </label>
                <textarea
                  id={`description-${dropdown.id}`}
                  value={dropdown.fields.description || ""}
                  onChange={(e) =>
                    handleFieldChange(index, "description", e.target.value)
                  }
                  placeholder="Add your description here"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {dropdown.selectedType === "Point" && (
              <div>
                <label
                  htmlFor={`point-${dropdown.id}`}
                  className="block font-semibold"
                >
                  Add List Item
                </label>
                <input
                  type="text"
                  value={dropdown.fields.newPoint || ""}
                  onChange={(e) => handlePointChange(index, e)}
                  placeholder="Enter a point"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => addPoint(index)}
                  className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md"
                >
                  Add Point
                </button>

                <ul className="mt-4">
                  {dropdown.fields.points &&
                    dropdown.fields.points.map((point, idx) => (
                      <li key={idx} className="flex items-center mt-2">
                        <span className="w-2.5 h-2.5 bg-gray-800 rounded-full mr-2"></span>
                        {point}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {dropdown.selectedType === "Embed Link" && (
              <div>
                <label
                  htmlFor={`embedLink-${dropdown.id}`}
                  className="block font-semibold"
                >
                  Embed Link
                </label>
                <input
                  type="url"
                  id={`embedLink-${dropdown.id}`}
                  value={dropdown.fields.embedLink || ""}
                  onChange={(e) =>
                    handleFieldChange(index, "embedLink", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Embed Link"
                />
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-between space-x-16">
          <button
            className="px-6 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            onClick={handleSubmit}
          >
            Save
          </button>
          <button
            className="px-6 w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
            onClick={() => navigate("/dashboard")}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Write;
