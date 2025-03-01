const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

// Home Page (Speech-to-Text)
router.get("/", async (req, res) => {
    try {
        const notes = await Note.find();
        res.render("index", { notes });
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).send("Error loading notes");
    }
});

// Saved Notes Page
router.get("/save", async (req, res) => {
    try {
        const notes = await Note.find();
        res.render("savedNotes", { notes });
    } catch (error) {
        console.error("Error fetching saved notes:", error);
        res.status(500).send("Error loading saved notes");
    }
});

// Save New Note
router.post("/save", async (req, res) => {
    const { text } = req.body;
    if (!text.trim()) return res.redirect("/");

    try {
        await Note.create({ text });
        res.redirect("/savedNotes"); // Redirects to saved notes after adding
    } catch (error) {
        console.error("Error saving note:", error);
        res.status(500).send("Error saving note");
    }
});

// Delete Note
router.post("/delete/:id", async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.redirect("/savedNotes");
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).send("Error deleting note");
    }
});

// Edit Note
router.post("/edit/:id", async (req, res) => {
    const { text } = req.body;
    if (!text.trim()) return res.redirect("/savedNotes");

    try {
        await Note.findByIdAndUpdate(req.params.id, { text });
        res.redirect("/savedNotes");
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).send("Error updating note");
    }
});

module.exports = router;
