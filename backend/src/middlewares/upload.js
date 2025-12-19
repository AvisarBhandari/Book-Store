import multer from "multer";
import path from "path";

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "coverImage") cb(null, "uploads/covers");
    else if (file.fieldname === "bookFile") cb(null, "uploads/books");
    else cb(new Error("Invalid field name"), null);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });
export default upload;
