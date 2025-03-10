const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    keyPoints: {
        type: String,
        default: '',
    },
    detailedNotes: {
        type: String, 
        default: '',
    },
    summary: {
        type: String, 
        default: '',
    },

    folderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Note', NoteSchema);
