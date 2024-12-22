const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    parentFolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder', // Reference to another folder
        default: null,
    },
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note', // Reference to notes in this folder
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the user who owns this folder
        required: true,
    },
});

FolderSchema.pre('validate', async function (next) {
    if (this.parentFolder) {
        // Find the parent folder
        const parent = await mongoose.model('Folder').findById(this.parentFolder);

        if (!parent) {
            throw new Error('Parent folder does not exist.');
        }

        // Ensure the parent folder belongs to the same user
        if (parent.user.toString() !== this.user.toString()) {
            throw new Error('You cannot nest folders within a folder you do not own.');
        }

        // Check nesting depth
        let depth = 1;
        let current = parent;
        while (current && current.parentFolder) {
            depth += 1;
            current = await mongoose.model('Folder').findById(current.parentFolder);
        }
        if (depth >= 3) {
            throw new Error('Maximum folder nesting level of 3 exceeded.');
        }
    }
    next();
});

FolderSchema.methods.addNote = async function (noteId, userId) {
    // Ensure the folder belongs to the user
    if (this.user.toString() !== userId.toString()) {
        throw new Error('You cannot add a note to a folder you do not own.');
    }

    // Check if the note belongs to the same user
    const note = await mongoose.model('Note').findById(noteId);
    if (!note) {
        throw new Error('Note does not exist.');
    }
    if (note.user.toString() !== userId.toString()) {
        throw new Error('You cannot add a note that does not belong to you.');
    }

    // Add the note if it is not already included
    if (!this.notes.includes(noteId)) {
        this.notes.push(noteId);
        await this.save();
    }
};



module.exports = mongoose.model('Folder', FolderSchema);
