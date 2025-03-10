const express = require('express');
const Note = require('../models/Note');
const Folder = require('../models/Folder');
const authenticate = require('../middleware/authMiddleware');
const validateObject = require('../middleware/validateObject');
const router = express.Router();
const { noteSchema } = require('../utils/validation');


// Create a new note and associate it with a folder
router.post('/', authenticate, async (req, res, next) => {
    const { error } = noteSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { title, keyPoints, detailedNotes, summary, folderId } = req.body;

    try {
        const note = new Note({
            title,
            keyPoints,
            detailedNotes,
            summary,
            user: req.user.id,
            folderId: folderId || null, 
        });
        const savedNote = await note.save();

        if (folderId) {
            const folder = await Folder.findOne({ _id: folderId, user: req.user.id });
            if (folder) {
                folder.notes.push(savedNote._id);
                await folder.save();
            } else {
                const error = new Error('Folder not found');
                error.status = 404; 
                return next(error);
            }
        }

        res.status(201).json(savedNote);
    } catch (err) {
        next(err); 
    }
});


// Get all notes for the logged-in user
router.get('/', authenticate, async (req, res, next) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.status(200).json(notes);
    } catch (err) {
        next(err); 
    }
});

// Get a single note by ID
router.get('/:id',[authenticate, validateObject], async (req, res, next) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
        if (!note) {
            const error = new Error('Note not found');
            error.status = 404; // Not Found
            return next(error);
        }
        res.status(200).json(note);
    } catch (err) {
        next(err);
    }
});

// Update a note by ID
router.put('/:id', [authenticate, validateObject], async (req, res, next) => {
    const { error } = noteSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { title, keyPoints, detailedNotes, summary } = req.body;

    try {
        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title, keyPoints, detailedNotes, summary },
            { new: true, runValidators: true }
        );
        if (!updatedNote) {
            const error = new Error('Note not found');
            error.status = 404; // Not Found
            return next(error);
        }
        res.status(200).json(updatedNote);
    } catch (err) {
        next(err);
    }
});

// PATCH /api/notes/:id/folder
router.patch('/:id/folder', authenticate, async (req, res, next) => {
    const { newFolderId } = req.body;
    try {
      const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      const oldFolderId = note.folderId ? note.folderId.toString() : null;
      const newFolderIdStr = newFolderId ? newFolderId.toString() : null;
      
      note.folderId = newFolderId || null;
      await note.save();
  
      if (oldFolderId && oldFolderId !== newFolderIdStr) {
        await Folder.findOneAndUpdate(
          { _id: oldFolderId, user: req.user.id },
          { $pull: { notes: note._id } }
        );
      }
      if (newFolderId) {
        await Folder.findOneAndUpdate(
          { _id: newFolderId, user: req.user.id },
          { $addToSet: { notes: note._id } }
        );
      }
      res.status(200).json(note);
    } catch (err) {
      next(err);
    }
  });
  


// Delete a note by ID
router.delete('/:id', [authenticate, validateObject], async (req, res, next) => {
    try {
      const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      await Note.deleteOne({ _id: note._id, user: req.user.id });
      
      if (note.folderId) {
        await Folder.findOneAndUpdate(
          { _id: note.folderId, user: req.user.id },
          { $pull: { notes: note._id } }
        );
      }
      res.status(200).json({ message: 'Note deleted successfully' });
    } catch (err) {
      next(err);
    }
  });
  

module.exports = router;
