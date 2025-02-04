const express = require("express");
const pool = require("../config/db");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

// Add
router.post("/", authenticateToken, async (req, res) => {
    try {
        const { title, author, isbn, published_year } = req.body;

        if (!title || !author || !isbn || !published_year) {
            return res.status(400).json({ error: "Please fill in all information completely." });
        }

        const result = await pool.query(
            "INSERT INTO books (title, author, isbn, published_year) VALUES ($1, $2, $3, $4) RETURNING *",
            [title, author, isbn, published_year]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update
router.put("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, isbn, published_year } = req.body;

        const result = await pool.query(
            "UPDATE books SET title=$1, author=$2, isbn=$3, published_year=$4 WHERE id=$5 RETURNING *",
            [title, author, isbn, published_year, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "The book you want to edit was not found." });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM books WHERE id=$1", [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "The book you want to delete was not found." });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Search
router.get("/", authenticateToken, async (req, res) => {
    try {
        const { title, author, isbn } = req.query;
        const conditions = [];
        const values = [];
        let query = "SELECT * FROM books";

        if (title) {
            conditions.push(`title ILIKE $${values.length + 1}`);
            values.push(`%${title}%`);
        }
        if (author) {
            conditions.push(`author ILIKE $${values.length + 1}`);
            values.push(`%${author}%`);
        }
        if (isbn) {
            conditions.push(`isbn = $${values.length + 1}`);
            values.push(isbn);
        }
        
        if (conditions.length) query += " WHERE " + conditions.join(" AND ");

        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
