const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const booksRoutes = require("./routes/books");

dotenv.config();

const app = express();
app.use(express.json());

app.post("/auth/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "password") {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.json({ token });
    }

    res.status(401).json({ error: "Invalid credentials" });
});

// 📌 Routes สำหรับการจัดการหนังสือ
app.use("/api/books", booksRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
