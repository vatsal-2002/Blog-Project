const BlogDetail = require("../models/BlogDetail");
const upload = require("../uploads/multer2");
const mongoose = require("mongoose");

// Post Blog Detail
const addNewBlog = async (req, res) => {
  try {
    const { title, shortDescription, dropdown, authorId } = req.body;

    const imageUrl =
      req.files && req.files.image
        ? `/uploads/${req.files.image[0].filename}`
        : null;

    if (!title || !shortDescription || !authorId) {
      return res
        .status(400)
        .json({ error: "Title, shortDescription, and authorId are required" });
    }

    const dropdownData = Array.isArray(dropdown)
      ? dropdown.map((item) => {
          const fields = item.fields ? { ...item.fields } : {};

          if (
            item.selectedType === "Single Image" &&
            req.files &&
            req.files.singleImage
          ) {
            fields.singleImage = `/uploads/${req.files.singleImage[0].filename}`;
          }

          if (item.selectedType === "Double Image" && req.files) {
            if (req.files.leftImage) {
              fields.leftImage = `/uploads/${req.files.leftImage[0].filename}`;
            }
            if (req.files.rightImage) {
              fields.rightImage = `/uploads/${req.files.rightImage[0].filename}`;
            }
          }

          return {
            selectedType: item.selectedType,
            fields,
          };
        })
      : [];

    const newBlog = new BlogDetail({
      title,
      shortDescription,
      imageUrl,
      dropdown: dropdownData,
      authorId,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    console.error("Error while creating blog:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get User Private all Blog Details
const getPrivateBlogs = async (req, res) => {
  const { authorId } = req.query;

  try {
    const blogs = await BlogDetail.find({ authorId }).populate("authorId");
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Blog Detail By Blog Id
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await BlogDetail.findById(id).populate(
      "authorId",
      "username email"
    );

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Blog Details
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogDetail.find()
      .sort({ createdAt: -1 })
      .populate("authorId", "username email")
      .exec();

    const formattedBlogs = blogs.map((blog) => ({
      _id: blog._id,
      title: blog.title,
      shortDescription: blog.shortDescription,
      imageUrl: blog.imageUrl,
      dropdown: blog.dropdown.map((item) => ({
        selectedType: item.selectedType,
        fields: {
          ...item.fields,
          points: item.fields.points || [],
        },
      })),
      author: {
        username: blog.authorId.username,
        email: blog.authorId.email,
      },
    }));

    res.status(200).json(formattedBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update the BlogDetail By Blog Id
const updateBlogDetail = async (req, res) => {
  const { id } = req.params;
  const { title, shortDescription, dropdown, authorId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid blog ID" });
    }

    const blog = await BlogDetail.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (req.files && req.files.image) {
      blog.imageUrl = `/uploads/${req.files.image[0].filename}`;
    }

    blog.title = title || blog.title;
    blog.shortDescription = shortDescription || blog.shortDescription;
    blog.authorId = authorId || blog.authorId;

    if (dropdown) {
      const dropdownData = Array.isArray(dropdown)
        ? dropdown.map((item) => {
            const fields = item.fields ? { ...item.fields } : {};

            if (
              item.selectedType === "Single Image" &&
              req.files &&
              req.files.singleImage
            ) {
              fields.singleImage = `/uploads/${req.files.singleImage[0].filename}`;
            }

            if (item.selectedType === "Double Image" && req.files) {
              if (req.files.leftImage) {
                fields.leftImage = `/uploads/${req.files.leftImage[0].filename}`;
              }
              if (req.files.rightImage) {
                fields.rightImage = `/uploads/${req.files.rightImage[0].filename}`;
              }
            }

            return {
              selectedType: item.selectedType,
              fields,
            };
          })
        : blog.dropdown;

      blog.dropdown = dropdownData;
    }

    const updatedBlog = await blog.save();
    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete Blog Detail By Id
const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBlog = await BlogDetail.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete All Blog Details
const deleteAllBlogs = async (req, res) => {
  try {
    const deletedBlogs = await BlogDetail.deleteMany({});

    if (deletedBlogs.deletedCount === 0) {
      return res.status(404).json({ message: "No blogs found to delete" });
    }

    res.status(200).json({
      message: `${deletedBlogs.deletedCount} blog(s) deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllBlogs,
  addNewBlog,
  getBlogById,
  deleteBlogById,
  deleteAllBlogs,
  getPrivateBlogs,
  updateBlogDetail,
};
