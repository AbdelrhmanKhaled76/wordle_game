const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.urlencoded({ extended: true }));
let document;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    document = mongoose.connection.collection("words");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/api/new-word", async (req, res) => {
  try {
    if (!document) {
      return res.status(500).json({ error: "Database not connected" });
    }

    const [randomWord] = await document
      .aggregate([{ $sample: { size: 1 } }])
      .toArray();

    res.status(200).json({
      message: "Fetched a random word successfully",
      status: 200,
      word: randomWord?.word || "No words found",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch words" });
  }
});

app.get("/api/check-word", async (req, res) => {
  try {
    if (!document) {
      return res.status(500).json({ error: "Database not connected" });
    }

    const { searchWord } = req.query;

    if (!searchWord) {
      return res.status(400).json({ error: "No word sent for search" });
    }

    const data = await document
      .find({ word: { $regex: new RegExp(`^${searchWord}$`, "i") } })
      .toArray();

    res.status(data.length > 0 ? 200 : 404).json({
      exists: data.length > 0,
      word: searchWord,
      message: data.length > 0 ? "Word found" : "Word not found",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch words" });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
