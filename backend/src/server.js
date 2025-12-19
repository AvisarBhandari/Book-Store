import express from "express";
import dotenv from "dotenv";
import bookRoutes from "./routes/bookRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use("/api/book", bookRoutes);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
