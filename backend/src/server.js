import express from "express";
import dotenv from "dotenv";
import path from "path";
import { connectDB } from "./config/db.js";
import bookRoutes from "./routes/bookRoutes.js";
import sellerRoutes from './routes/sellerRoutes.js'
import rateLimiter from "./middlewares/rateLimiter.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(rateLimiter);
app.use((req, res, next) => {
  console.log("Request method:", req.method, "req path:", req.path);
  next();
});


app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// API routes
app.use("/api/book", bookRoutes);
app.use("/api/seller", sellerRoutes);

// Connect DB and start server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
