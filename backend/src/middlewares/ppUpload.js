import multer from "multer";
import path from "path";

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "ppadmin") cb(null, "uploads/picture/admin");
    else if (file.fieldname === "ppseller") cb(null, "uploads/picture/seller");
    else if (file.fieldname === "ppuser") cb(null, "uploads/picture/user");
    else cb(new Error("Invalid field name"), null);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });
export default upload;
