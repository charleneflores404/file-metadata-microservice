const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
// const bodyParser = require("body-parser");
// const upload = multer({ dest: "uploads/" });
const upload = multer({ storage: multer.memoryStorage() });

// const storage = multer.diskStorage({
//   destination: (req, res, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "-" + Date.now());
//   },
// });

// const upload = multer({ storage: storage });

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static("views"));

// connect to db
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;

const fileSchema = new Schema({
  // file: { type: Buffer }, // check
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/api/fileanalyse", upload.single("upfile"), async (req, res) => {
  if (!req.file) return res.json({ error: "No file uploaded" });
  const fileData = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  };
  await File.create(fileData);
  res.json(fileData);
});

const port = process.env.PORT || 8080 || 3000;
app.listen(port, () => {
  console.log("Your app is listening on port " + port);
});
