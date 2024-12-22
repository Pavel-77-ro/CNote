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
        required: false,
        default: ''
    },
    summary: {
        type: String, // Stores the summary of the note
        default: '',
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
