const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dns = require("dns");

const userAuth = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const activityRoutes = require("./routes/activityRoutes");

require("dotenv").config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const server = express();

// =========================
// MIDDLEWARE
// =========================

server.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

server.use(express.json());

server.use(cookieParser());

// =========================
// ROUTES
// =========================

server.use(userAuth);

server.use("/tasks", taskRoutes);

server.use("/history", activityRoutes);

// =========================
// TEST
// =========================

server.get("/test", (req, res) => {
  res.json({
    message: "Server is working",
  });
});

// =========================
// DATABASE
// =========================

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDb Connected");

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });
