// routes/auth.js
import express from 'express';
import {
    register,
    login,
    logout,
    getUserProfile,
    registerValidation,
    loginValidation
} from '../controllers/auth.js';
import { protect, authorize } from '../middleware/auth.js';
import isEmail from 'validator/lib/isEmail.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);

// Protected routes
router.use(protect); // Apply protect middleware to all routes below
router.get('/profile', getUserProfile);

// Admin routes
router.get('/admin', authorize('admin'), (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Admin access granted'
    });
});

// Auth check route - use protect instead of auth since that's what you imported
router.get('/check', protect, async (req, res) => {
    try {
        // Assuming you're using JWT and have the user info in req.user
        return res.status(200).json({
            isAuthenticated: true,
            user: req.user // Changed from req.email to req.user since that's more common
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
});

export default router;