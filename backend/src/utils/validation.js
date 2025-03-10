const Joi = require('joi');

// Schema for user registration
const registerSchema = Joi.object({
    username: Joi.string().max(30).required().messages({
        'string.base': 'Username must be a string.',
        'string.empty': 'Username is required.',
        'string.max': 'Username must not exceed 30 characters.',
        'any.required': 'Username is required.',
    }),
    password: Joi.string().min(8).required().messages({
        'string.base': 'Password must be a string.',
        'string.empty': 'Password is required.',
        'string.min': 'Password must be at least 8 characters long.',
        'any.required': 'Password is required.',
    }),
});

// Schema for login
const loginSchema = Joi.object({
    username: Joi.string().required().messages({
        'string.base': 'Username must be a string.',
        'string.empty': 'Username is required.',
        'any.required': 'Username is required.',
    }),
    password: Joi.string().required().messages({
        'string.base': 'Password must be a string.',
        'string.empty': 'Password is required.',
        'any.required': 'Password is required.',
    }),
});

// Schema for creating a folder
const folderSchema = Joi.object({
    name: Joi.string().max(50).required().messages({
        'string.base': 'Folder name must be a string.',
        'string.empty': 'Folder name is required.',
        'string.max': 'Folder name must not exceed 50 characters.',
        'any.required': 'Folder name is required.',
    }),
    parentFolder: Joi.string().optional().allow(null),
});

// Schema for creating/updating a note
const noteSchema = Joi.object({
    title: Joi.string().max(100).required().messages({
        'string.base': 'Note title must be a string.',
        'string.empty': 'Note title is required.',
        'string.max': 'Note title must not exceed 100 characters.',
        'any.required': 'Note title is required.',
    }),
    detailedNotes: Joi.string().allow('').optional().messages({
        'string.base': 'Detailed notes must be a string.',
    }),
    keyPoints: Joi.string().max(300).allow('').optional().messages({
        'string.base': 'Key points must be a string.',
        'string.max': 'Key points must not exceed 300 characters.',
    }),
    summary: Joi.string().max(300).allow('').optional().messages({
        'string.base': 'Summary must be a string.',
        'string.max': 'Summary must not exceed 300 characters.',
    }),
    folderId: Joi.string().optional().allow(null).messages({
        'string.base': 'Folder ID must be a string.',
    }),
});


module.exports = { registerSchema, loginSchema, folderSchema, noteSchema };
