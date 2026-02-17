/**
 * Authentication Routes
 */

import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (requires authentication)
router.get('/me', authenticate, getMe);

// Import update profile and password change functions
import { updateProfile, changePassword } from '../controllers/authController';

router.patch('/profile', authenticate, updateProfile);
router.post('/change-password', authenticate, changePassword);

export default router;
