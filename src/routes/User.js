import express from 'express';
import UserController from '../controllers/UserController.js';
import {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
} from '../validators/UserValidator.js';
import { authMiddleware } from '../middlewares/auth.js';
const router = express.Router();

router.post(
  '/users',
  authMiddleware,
  createUserValidator,
  UserController.createUser
);

router.get('/users/:id', authMiddleware, UserController.getUser);
router.get('/profile', authMiddleware, UserController.getProfile);
router.get('/users', authMiddleware, UserController.getAllUsers);
router.put(
  '/users/:id',
  authMiddleware,

  updateUserValidator,
  UserController.updateUser
);
router.delete(
  '/users/:id',
  authMiddleware,
  deleteUserValidator,
  UserController.deleteUser
);

router.post('/request-password-reset', UserController.requestPasswordReset);
router.post('/reset-password', UserController.resetPassword);
router.put('/profile', authMiddleware, UserController.updateProfile);

export default router;
