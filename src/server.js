require("dotenv").config();
const express = require("express");
const schoolRoutes = require("./routes/schoolRoutes");
const pool = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ success: true, message: "School Management API is running" });
});

// School routes
app.use("/", schoolRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found." });
});

// Start server after confirming DB connection
async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL connected successfully.");
    connection.release();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MySQL:", error.message);
    process.exit(1);
  }
}

startServer();
