const express = require('express');
const Folder = require('../models/Folder');
const Note = require('../models/Note')
const authenticate = require('../middleware/authMiddleware');
const validateObject = require('../middleware/validateObject');
const { folderSchema } = require('../utils/validation'); // Import the Joi schema for folder validation
const router = express.Router();

// Create a new folder
router.post('/', authenticate, async (req, res, next) => {
    const { error } = folderSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { name, parentFolder } = req.body;

    try {
        const newFolder = new Folder({
            name,
            parentFolder,
            user: req.user.id, // Associate the folder with the logged-in user
        });
        const savedFolder = await newFolder.save();
        res.status(201).json(savedFolder);
    } catch (err) {
        next(err); // Forward unexpected errors to the error handler
    }
});

// Update a folder by ID
router.put('/:id', [authenticate, validateObject], async (req, res, next) => {
    const { error } = folderSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { name, parentFolder } = req.body;

    try {
        const updatedFolder = await Folder.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { name, parentFolder },
            { new: true, runValidators: true } // Return the updated document and apply validation
        );

        if (!updatedFolder) {
            const error = new Error('Folder not found');
            error.status = 404; // Not Found
            return next(error);
        }

        res.status(200).json(updatedFolder);
    } catch (err) {
        next(err); // Forward unexpected errors to the error handler
    }
});

// Get all folders for the logged-in user
router.get('/', authenticate, async (req, res, next) => {
    try {
        const folders = await Folder.find({ user: req.user.id }).populate('notes').exec();
        res.status(200).json(folders);
    } catch (err) {
        next(err); // Forward unexpected errors to the error handler
    }
});

// PATCH /api/folders/:id/parent
router.patch('/:id/parent', authenticate, async (req, res, next) => {
    const { newParentId } = req.body;

    try {
        // Find the folder being moved
        const folder = await Folder.findOne({ _id: req.params.id, user: req.user.id });
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }

        // Update only the parentFolder
        folder.parentFolder = newParentId || null;
        await folder.save();

        // Optionally, if you store subfolders/notes arrays in the parent,
        // you'd update them here as well.

        res.status(200).json({ message: 'Folder moved successfully' });
    } catch (err) {
        next(err);
    }
});


// Get a single folder by ID
router.get('/:id', [authenticate, validateObject], async (req, res, next) => {
    try {
        const folder = await Folder.findOne({ _id: req.params.id, user: req.user.id }).populate('notes').exec();
        if (!folder) {
            const error = new Error('Folder not found');
            error.status = 404; // Not Found
            return next(error);
        }
        res.status(200).json(folder);
    } catch (err) {
        next(err); // Forward unexpected errors to the error handler
    }
});

// Delete a folder
router.delete('/:id', [authenticate, validateObject], async (req, res, next) => {
    try {
        // Find the folder to delete
        const folder = await Folder.findOne({ _id: req.params.id, user: req.user.id });
        if (!folder) {
            const error = new Error('Folder not found');
            error.status = 404;
            return next(error);
        }
        
        // Capture the deleted folder's parent (if any)
        const parentOfDeleted = folder.parentFolder || null;
        
        // Delete the folder
        await Folder.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        
        // Reassign child folders to the deleted folder's parent
        await Folder.updateMany(
            { parentFolder: folder._id, user: req.user.id },
            { parentFolder: parentOfDeleted }
        );
        
        // Reassign notes from the deleted folder to the deleted folder's parent
        await Note.updateMany(
            { folderId: folder._id, user: req.user.id },
            { folderId: parentOfDeleted }
        );
        
        // Now update the parent's notes array (if a parent exists)
        if (parentOfDeleted) {
            // Find all notes that now have folderId equal to the parent's _id
            const notesInParent = await Note.find({ folderId: parentOfDeleted, user: req.user.id });
            // Update parent's "notes" field with the new note IDs
            await Folder.findOneAndUpdate(
                { _id: parentOfDeleted, user: req.user.id },
                { notes: notesInParent.map(note => note._id) }
            );
        }
        
        res.status(200).json({ message: 'Folder deleted successfully' });
    } catch (err) {
        next(err);
    }
});



module.exports = router;
