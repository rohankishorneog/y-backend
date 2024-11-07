require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./api/auth");
const dataRoutes = require("./api/data");
const {
  setPreferences,
  clearPreferences,
} = require("./middleware/cookieManagement");

const app = express();

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);
app.post("/api/preferences", setPreferences);
app.delete("/api/preferences", clearPreferences);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
