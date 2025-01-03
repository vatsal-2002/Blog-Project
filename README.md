<!-- Blog List Project -->

### Project Overview

The project consists of a React-based frontend that interacts with a Node.js backend API. The frontend displays a list of blogs fetched from the backend, allows search functionality, and shows details like the blog title and author. Users can also create, update, or delete blog posts via the backend.

### Technologies Used

<!-- Frontend: -->

- React.js - Library for building the user interface.
- Axios - HTTP client for making API requests to the backend.
- Tailwind CSS - Styles for the frontend UI.

<!-- Backend: -->

- Node.js - JavaScript runtime used to build the backend.
- Express.js - Web framework for Node.js.
- MongoDB - NoSQL database for storing blog data.
- Mongoose - ODM (Object Data Modeling) for MongoDB.
- JWT (JSON Web Token) - For handling user authentication.

### Frontend Setup

1. Clone the Repository:
   git clone https://github.com/your-username/blog-list-project.git
   cd blog-list-project

2. Install Dependencies:
   npm install

3. Run the Frontend Development Server:
   npm start

### Backend Setup

1. Clone the Repository:
   git clone https://github.com/your-username/blog-list-project.git
   cd blog-list-project/backend

2. Install Dependencies:
   npm install

3. Set Up Environment Variables: Create a .env file
   MONGO_URI=your-mongodb-uri
   PORT=5000
   JWT_SECRET=your-jwt-secret

- MONGO_URI: The MongoDB URI connection string (e.g., mongodb://localhost:27017/blogdb or MongoDB Atlas URI).
- JWT_SECRET: A secret key used for generating JWT tokens (use a strong, random string).

4. Run the Backend Server:
   npm start

## API Endpoints

- POST /api/register: Register a new user (requires username, email, and password in the body).
- POST /api/login: Log in an existing user (requires email and password).
- GET /api/blogs: Get a list of all blogs (no authentication required).
- GET /api/private-blogs: Get blogs of a specific author (requires authorId as a query parameter).
- POST /api/blogs: Create a new blog (requires title, shortDescription, content, and authorId).
- PUT /api/blogs/:id: Update an existing blog (requires title, shortDescription, and content).
- DELETE /api/blogs/:id: Delete a blog by its ID.

### Folder Structure

blog-list-project/
├── backend/
│ ├── controllers/ # Business logic for authentication and blog management
│ ├── models/ # Mongoose models (User, Blog)
│ ├── routes/ # API routes for user and blog functionalities
│ ├── uploads/ # Multer setup for file uploads (if needed)
│ ├── config/ # MongoDB connection setup
│ ├── .env # Environment variables for sensitive information
│ ├── server.js # Entry point to start the server
│ ├── package.json # Backend dependencies and scripts
├── frontend/
│ ├── src/
│ │ ├── components/ # React components (BlogList, SearchBar, etc.)
│ │ ├── App.js # Main app file
│ │ ├── index.js # React entry point
│ ├── package.json # Frontend dependencies and scripts
├── .gitignore # Git ignore file
├── README.md # Project documentation
