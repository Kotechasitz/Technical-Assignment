const express = require("express");
const Book = require("../models/Book");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

// Add a book
router.post("/", authenticateToken, async (req, res) => {
  const { title, author, isbn, published_year } = req.body;
  try {
    const newBook = new Book({ title, author, isbn, published_year });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a book
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, published_year } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, isbn, published_year },
      { new: true }
    );
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a book
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search books
router.get("/", authenticateToken, async (req, res) => {
  const { title, author, isbn } = req.query;
  const conditions = {};
  if (title) conditions.title = { $regex: title, $options: "i" };
  if (author) conditions.author = { $regex: author, $options: "i" };
  if (isbn) conditions.isbn = isbn;

  try {
    const books = await Book.find(conditions);
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
