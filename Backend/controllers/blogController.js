const Blog = require("../models/blogModel");

// Route to get all blogs
const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('authorId', 'username email');
        res.json(blogs);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).send('Server error');
    }
};

// Route to get private blogs for logged-in users
const getPrivateBlogs = async (req, res) => {
    const { authorId } = req.query;
    try {
        const blogs = await Blog.find({ authorId }).populate('authorId');
        res.json(blogs);
    } catch (error) {
        console.error("Error fetching private blogs:", error);
        res.status(500).send('Server error');
    }
};

// Route to add a new blog
const addBlog = async (req, res) => {
    const { title, shortDescription, content, authorId } = req.body;

    try {
        if (!title || !shortDescription || !content || !authorId) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const newBlog = new Blog({
            title,
            shortDescription,
            content,
            authorId,
        });

        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        console.error("Error creating blog:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

// Route to update a blog
const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, shortDescription, content } = req.body;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid blog ID');
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { title, shortDescription, content },
            { new: true, runValidators: true }
        );

        if (!updatedBlog) {
            return res.status(404).send('Blog not found');
        }

        res.status(200).json(updatedBlog);
    } catch (error) {
        console.error('Error updating blog:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).send(`Validation Error: ${error.message}`);
        }
        res.status(500).send('Server error');
    }
};

// Route to delete a blog
const deleteBlog = async (req, res) => {
    const { id } = req.params;
    try {
        await Blog.findByIdAndDelete(id);
        res.send('Blog deleted');
    } catch (error) {
        console.error("Error deleting blog:", error);
        res.status(500).send('Server error');
    }
};

module.exports = { getBlogs, getPrivateBlogs, addBlog, updateBlog, deleteBlog };
