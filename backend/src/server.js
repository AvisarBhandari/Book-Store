import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import bookRoutes from "./routes/bookRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import rateLimiter from "./middlewares/rateLimiter.js";
import categorieRoutes from "./routes/categorieRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
//TODO: add reporting , analytics , reviews ,recommendations,serch functionality,
// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(rateLimiter);
app.use((req, res, next) => {
  console.log("Request method:", req.method, "req path:", req.path);
  next();
});
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// API routes
app.use("/api/book", bookRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categorie", categorieRoutes);

// Connect DB and start server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
