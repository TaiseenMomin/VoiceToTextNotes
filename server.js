const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const Note = require("./models/Note");

dotenv.config();
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(express.static(path.join(__dirname, "../frontend"))); // Serve static files

// Set views directory to frontend
app.set("views", path.join(__dirname, "../frontend"));
app.set("view engine", "ejs");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.error("MongoDB Connection Error:", err));

// Home Route
app.get("/", async (req, res) => {
    try {
        const notes = await Note.find();
        res.render("index", { notes }); // Rendering index.ejs from frontend
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Route for Saved Notes
app.get("/savedNotes", async (req, res) => {
    try {
        const notes = await Note.find();
        res.render("savedNotes", { notes }); // Rendering savedNotes.ejs from frontend
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

// Save New Note
app.post("/save", async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim() === "") {
            return res.status(400).json({ error: "Error: Note cannot be empty!" });
        }

        const newNote = await Note.create({ text });
        console.log("✅ Note saved successfully:", newNote);

        res.json({ message: "Note saved successfully!", note: newNote });
    } catch (error) {
        console.error("❌ Error saving note:", error);
        res.status(500).json({ error: "Server Error: Could not save note." });
    }
});

// Update Note
app.post('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!text || text.trim() === "") {
            return res.status(400).send("Error: Note cannot be empty!");
        }

        await Note.findByIdAndUpdate(id, { text });
        console.log("✅ Note updated successfully:", text);

        res.redirect('/savedNotes');
    } catch (error) {
        console.error("❌ Error updating note:", error);
        res.status(500).send("Server Error: Could not update note.");
    }
});

app.post("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNote = await Note.findByIdAndDelete(id);

        if (!deletedNote) {
            return res.status(404).json({ error: "Note not found!" });
        }

        console.log("🗑️ Note deleted successfully:", deletedNote);
        res.sendStatus(200); // Send success status
    } catch (error) {
        console.error("❌ Error deleting note:", error);
        res.status(500).json({ error: "Server Error: Could not delete note." });
    }
});




// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
