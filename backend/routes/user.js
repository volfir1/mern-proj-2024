import express from 'express';
import { 
    register, 
    login, 
    logout,
    getUserProfile
} from '../controllers/auth.js';
import { protect, authorize } from '../middleware/auth.js';
import { check } from 'express-validator';

const router = express.Router();

// Validation rules - moved from controllers to routes
const registerValidation = [
    check('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    check('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    check('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
];

const loginValidation = [
    check('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    check('password')
        .exists()
        .withMessage('Password is required')
];

// Basic Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', logout);

// Protected Routes
router.get('/profile', protect, getUserProfile);

// Admin Route (if needed)
router.get('/admin', protect, authorize('admin'), (req, res) => {
    res.status(200).json({ message: 'Admin access granted' });
});

export default router;