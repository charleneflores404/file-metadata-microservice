const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const fileSchema = new mongoose.Schema({
  name: String,
  type: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Serve favicon to prevent route errors
const path = require("path");
app.get("/favicon.ico", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "favicon.ico"));
});

app.post("/api/fileanalyse", upload.single("upfile"), async (req, res) => {
  const fileData = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  };
  await File.create(fileData);
  res.json(fileData);
});

// Listen locally; if statement to prevent production error on vercel
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 3000;
  app.listen(port, function () {
    console.log("Your app is listening on port " + port);
  });
}

// Export app for Vercel serverless
module.exports = app;
