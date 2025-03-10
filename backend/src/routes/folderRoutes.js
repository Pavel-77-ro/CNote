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
            user: req.user.id,
        });
        const savedFolder = await newFolder.save();
        res.status(201).json(savedFolder);
    } catch (err) {
        next(err);
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
            { new: true, runValidators: true } 
        );

        if (!updatedFolder) {
            const error = new Error('Folder not found');
            error.status = 404;
            return next(error);
        }

        res.status(200).json(updatedFolder);
    } catch (err) {
        next(err);
    }
});

// Get all folders for the logged-in user
router.get('/', authenticate, async (req, res, next) => {
    try {
        const folders = await Folder.find({ user: req.user.id }).populate('notes').exec();
        res.status(200).json(folders);
    } catch (err) {
        next(err);
    }
});

// PATCH /api/folders/:id/parent
router.patch('/:id/parent', authenticate, async (req, res, next) => {
    const { newParentId } = req.body;

    try {
        const folder = await Folder.findOne({ _id: req.params.id, user: req.user.id });
        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }

        folder.parentFolder = newParentId || null;
        await folder.save();

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
            error.status = 404;
            return next(error);
        }
        res.status(200).json(folder);
    } catch (err) {
        next(err);
    }
});

// Delete a folder
router.delete('/:id', [authenticate, validateObject], async (req, res, next) => {
    try {
        const folder = await Folder.findOne({ _id: req.params.id, user: req.user.id });
        if (!folder) {
            const error = new Error('Folder not found');
            error.status = 404;
            return next(error);
        }

        const parentOfDeleted = folder.parentFolder || null;
        
        // Delete the folder
        await Folder.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        
        await Folder.updateMany(
            { parentFolder: folder._id, user: req.user.id },
            { parentFolder: parentOfDeleted }
        );
        
        await Note.updateMany(
            { folderId: folder._id, user: req.user.id },
            { folderId: parentOfDeleted }
        );
        
        if (parentOfDeleted) {
            const notesInParent = await Note.find({ folderId: parentOfDeleted, user: req.user.id });
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
