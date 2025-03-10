const mongoose = require('mongoose');

const FolderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    parentFolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null,
    },
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note',
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

FolderSchema.pre('validate', async function (next) {
    if (this.parentFolder) {
        
        const parent = await mongoose.model('Folder').findById(this.parentFolder);

        if (!parent) {
            throw new Error('Parent folder does not exist.');
        }

        
        if (parent.user.toString() !== this.user.toString()) {
            throw new Error('You cannot nest folders within a folder you do not own.');
        }

        
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

    if (this.user.toString() !== userId.toString()) {
        throw new Error('You cannot add a note to a folder you do not own.');
    }

    const note = await mongoose.model('Note').findById(noteId);
    if (!note) {
        throw new Error('Note does not exist.');
    }
    if (note.user.toString() !== userId.toString()) {
        throw new Error('You cannot add a note that does not belong to you.');
    }

    if (!this.notes.includes(noteId)) {
        this.notes.push(noteId);
        await this.save();
    }
};



module.exports = mongoose.model('Folder', FolderSchema);
