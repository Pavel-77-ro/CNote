const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging

    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error', // Send user-friendly error messages
    });
};

module.exports = errorHandler;
