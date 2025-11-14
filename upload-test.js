// upload-test.js
import express from "express";
import multer from "multer";

const app = express();

// super simple: store files in ./uploads folder
const upload = multer({ dest: "uploads/" });

// log every request
app.use((req, _res, next) => {
  console.log("→", req.method, req.originalUrl, "ctype:", req.headers["content-type"]);
  next();
});

// NO express.json() here

app.post("/api/suggest/image", upload.single("image"), (req, res) => {
  console.log("req.file =", req.file);
  if (!req.file) {
    return res.status(400).json({ error: "image required" });
  }

  // just echo back some info for now
  return res.json({
    ok: true,
    fieldname: req.file.fieldname,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
});

app.listen(4000, () => {
  console.log("TEST upload server on http://localhost:4000");
});
