const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    keyPoints: {
        type: String, // Stores the key points/questions
        default: '',
    },
    detailedNotes: {
        type: String, // Stores the detailed body of the note
        default: '',
    },
    summary: {
        type: String, // Stores the summary of the note
        default: '',
    },
    // New field: folderId is optional and references a Folder document
    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who owns this note
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Note', NoteSchema);
