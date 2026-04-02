const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const Book = require("./models/Book");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/book_list";

app.use(cors());
app.use(express.json());

const toClient = (doc) => ({
  id: doc._id.toString(),
  title: doc.title,
  author: doc.author,
});

app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find().sort({ bookId: 1, createdAt: 1 });
    res.json(books.map(toClient));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

app.post("/api/books", async (req, res) => {
  try {
    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).json({ message: "Title and author are required" });
    }

    const latestBook = await Book.findOne().sort({ bookId: -1 });
    const nextBookId = latestBook ? latestBook.bookId + 1 : 1;

    const created = await Book.create({ title, author, bookId: nextBookId });
    return res.status(201).json(toClient(created));
  } catch (error) {
    return res.status(500).json({ message: "Failed to create book" });
  }
});

app.put("/api/books/:id", async (req, res) => {
  try {
    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).json({ message: "Title and author are required" });
    }

    const updated = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.json(toClient(updated));
  } catch (error) {
    return res.status(500).json({ message: "Failed to update book" });
  }
});

app.delete("/api/books/:id", async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete book" });
  }
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  });