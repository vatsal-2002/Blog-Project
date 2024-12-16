const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");


const app = express();
const PORT = 5000;
const JWT_SECRET = "your_secret_key";

// Middleware
app.use(bodyParser.json());
app.use(cors());

const upload = multer();


// MongoDB connection
mongoose
  .connect("mongodb+srv://gajjarhiren2803:v2r5sKCuPtcyt3S2@cluster0.gtl0f.mongodb.net/blog_web", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema, "users");

// Routes

// Register
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    res.status(200).json({ token, username: user.username, authorId: user._id });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
});
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
});

const Blog = mongoose.model("Blog", blogSchema, "blogs");

// Route to get all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    // Fetch all blogs and populate authorId with corresponding user data
    const blogs = await Blog.find().populate('authorId', 'name email'); 
    // 'name email' selects only the name and email fields of the author
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).send('Server error');
  }
});
// Route to get private blogs for logged-in users
app.get('/api/private-blogs', async (req, res) => {
  const { authorId } = req.query;
  try {
    const blogs = await Blog.find({ authorId }).populate('authorId');
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching private blogs:", error);
    res.status(500).send('Server error');
  }
});

// Route to add a new blog
// Route to add a new blog
app.post("/api/blogs", upload.none(), async (req, res) => {
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
    res.status(201).json(savedBlog); // Send the saved blog data
  } catch (error) {
    console.error("Error creating blog:", error.message);
    res.status(500).json({ error: "Server error" });
  }
})

// Route to update a blog
app.get('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('Invalid blog ID');
    }

    // Find the blog by ID
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send('Blog not found');
    }

    // Send the blog data as response
    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).send('Server error');
  }
});
app.put('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  const { title, shortDescription, content } = req.body;

  try {
    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('Invalid blog ID');
    }

    // Update the blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, shortDescription, content },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).send('Blog not found');
    }

    // Send the updated blog as response
    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).send(`Validation Error: ${error.message}`);
    }

    res.status(500).send('Server error');
  }
});

// Route to delete a blog
app.delete('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Blog.findByIdAndDelete(id);
    res.send('Blog deleted');
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).send('Server error');
  }
});
// Serve static files from React app
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
