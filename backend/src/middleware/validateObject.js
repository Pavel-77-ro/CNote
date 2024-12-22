const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    next();
};

module.exports = validateObjectId;
