import express from 'express';
import UserController from '../controllers/UserController.js';
import {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
} from '../validators/UserValidator.js';
// import { authMiddleware } from '../middlewares/auth.js';
const router = express.Router();

router.post(
  '/users',
  // authMiddleware,
  createUserValidator,
  UserController.createUser
);
router.post(
  '/login',
  // authMiddleware,
  createUserValidator,
  UserController.login
);
router.get('/users/:id', 
  // authMiddleware,
   UserController.getUser);
router.get('/users', 
  // authMiddleware,
   UserController.getAllUsers);
router.put(
  '/users/:id',
  // authMiddleware,
  updateUserValidator,
  UserController.updateUser
);
router.delete(
  '/users/:id',
  // authMiddleware,
  deleteUserValidator,
  UserController.deleteUser
);

export default router;
