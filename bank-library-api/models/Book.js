const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  isbn: String,
  published_year: Number,
});

module.exports = mongoose.model("Book", bookSchema);
