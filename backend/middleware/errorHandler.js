// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Add to your app.js or main file
app.use(errorHandler);