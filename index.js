const express = require("express");
const cors = require("cors");

const app = express();

const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/fileanalyse", upload.single("upfile"), (req, res, next) => {
  const file = req.file;
  res.json({
    name: file.originalname,
    type: file.mimetype,
    size: file.size,
  });
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
