import express from "express";
import dotenv from "dotenv";
import bookRoutes from "./routes/bookRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const port = 5001;

connectDB();

app.use("/api/book", bookRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
