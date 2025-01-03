const express = require("express");
const { addNewBlog, getAllBlogs, getBlogById, getPrivateBlogs, deleteBlogById, deleteAllBlogs, updateBlogDetail } = require("../controllers/blogDetailController");
const upload = require("../uploads/multer2");

const router = express.Router();

router.post(
    "/blog-details",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "singleImage", maxCount: 10 },
        { name: "leftImage", maxCount: 10 },
        { name: "rightImage", maxCount: 10 },
    ]),
    addNewBlog
);

router.put(
    "/blog-details/:id",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "singleImage", maxCount: 10 },
        { name: "leftImage", maxCount: 10 },
        { name: "rightImage", maxCount: 10 },
    ]),
    updateBlogDetail
);

router.get("/blog-details", getAllBlogs);
router.get("/blog-details/private", getPrivateBlogs);
router.get("/blog-details/:id", getBlogById);
router.delete("/blog-details/:id", deleteBlogById);
router.delete("/blog-details", deleteAllBlogs);

module.exports = router;
