const express = require("express");
const upload = require("../uploads/multer");
const {
    getBlogs,
    getPrivateBlogs,
    getBlogById,
    addBlog,
    updateBlog,
    deleteBlog,
} = require("../controllers/blogController");

const router = express.Router();

// Blog-related routes
router.get("/blogs", getBlogs);
router.get("/private-blogs", getPrivateBlogs);
router.get("/blogs/:id", getBlogById);
router.post("/blogs", upload.single("image"), addBlog);
router.put("/blogs/:id", upload.single("image"), updateBlog);
router.delete("/blogs/:id", deleteBlog);

module.exports = router;
