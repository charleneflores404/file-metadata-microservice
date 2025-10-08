const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// connect to db
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDb connected"))
//   .catch((err) => console.log(err));

// const Schema = mongoose.Schema;

// const fileSchema = new Schema({
//   file: { type: Buffer }, // check
//   name: { type: String, required: true },
//   type: { type: String, required: true },
//   size: { type: Number, required: true },
// });

// const File = mongoose.model("File", fileSchema);

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
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});

app.post("/api/fileanalyse", upload.single("upfile"), (req, res, next) => {
  const file = req.file;
  res.json({
    name: file.originalname,
    type: file.mimetype,
    size: file.size,
  });
});
