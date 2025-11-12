const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const app = express();

// const upload = multer({ dest: "uploads/" });
const upload = multer({ storage: multer.memoryStorage() }); // use memory storage instead of disk as vercel cannot write to disk

app.use(cors());
app.use(express.urlencoded({ extended: true }));

// serve public files
app.use("/public", express.static(path.join(__dirname, "public")));

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const fileSchema = new mongoose.Schema({
  name: String,
  type: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Serve favicon to prevent route errors
// app.get("/favicon.ico", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "favicon.ico"));
// });
app.get("/favicon.ico", (req, res) => res.status(204).end());

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
