require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const blogDetail = require("./routes/BlogDetailRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

connectDB();

app.use("/uploads", express.static("uploads"));

app.use("/api", authRoutes);
app.use("/api", blogRoutes);
app.use("/api", blogDetail);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
