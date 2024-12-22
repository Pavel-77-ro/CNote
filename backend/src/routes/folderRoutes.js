const express = require('express');
const Folder = require('../models/Folder');
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
        const folder = await Folder.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!folder) {
            const error = new Error('Folder not found');
            error.status = 404; // Not Found
            return next(error);
        }
        res.status(200).json({ message: 'Folder deleted successfully' });
    } catch (err) {
        next(err); // Forward unexpected errors to the error handler
    }
});

module.exports = router;
