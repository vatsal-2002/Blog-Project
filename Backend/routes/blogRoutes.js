const express = require("express");
const upload = require("../uploads/multer");
const {
    getBlogs,
    getPrivateBlogs,
    addBlog,
    updateBlog,
    deleteBlog,
} = require("../controllers/blogController");

const router = express.Router();

// Blog-related routes
router.get("/blogs", getBlogs);
router.get("/private-blogs", getPrivateBlogs);
router.post("/blogs", upload.none(), addBlog);
router.get("/blogs/:id", updateBlog);
router.put("/blogs/:id", updateBlog);
router.delete("/blogs/:id", deleteBlog);

module.exports = router;
