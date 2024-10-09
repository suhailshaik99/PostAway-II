import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import AppError from "../utils/AppError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadFolder = path.join(__dirname, "..", "uploads");

// if (!fs.existsSync(uploadFolder)) {
//   fs.mkdirSync(uploadFolder, { recursive: true });
// }

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Invalid file type. Only JPEG, PNG AND GIF are allowed.",
        400
      ),
      false
    );
  }
};

export const upload = multer({ storage, fileFilter });
