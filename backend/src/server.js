import express from "express";
import dotenv from "dotenv";
import bookRoutes from "./routes/bookRoutes.js";
import { connectDB } from "./config/db.js";
import path from "path";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Parse JSON
app.use(express.json());

app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// API routes
app.use("/api/book", bookRoutes);

// Connect DB and start server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
