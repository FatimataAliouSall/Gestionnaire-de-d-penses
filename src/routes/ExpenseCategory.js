import express from 'express';
import ExpenseCategoryController from '../controllers/ExpenseCategoryController.js';
import {
  createExpenseCategoryValidator,
  updateExpenseCategoryValidator,
  deleteExpenseCategoryValidator,
} from '../validators/ExpenseCategoryValidator.js';
import { authMiddleware } from '../middlewares/auth.js';
// import { authRoleAdmin } from '../middlewares/authRoleAdmin.js';

const router = express.Router();

router.post(
  '/expense-categories',
  authMiddleware,
  // authRoleAdmin,
  createExpenseCategoryValidator,
  ExpenseCategoryController.createExpenseCategory
);
router.get(
  '/expense-categories/:id',
  authMiddleware,
  // authRoleAdmin,
  ExpenseCategoryController.getExpenseCategorieById
);
router.get(
  '/expense-categories',
  authMiddleware,
  // authRoleAdmin,
  ExpenseCategoryController.getAllExpenseCategories
);
router.put(
  '/expense-categories/:id',
  authMiddleware,
  // authRoleAdmin,
  updateExpenseCategoryValidator,
  ExpenseCategoryController.updateExpenseCategory
);
router.delete(
  '/expense-categories/:id',
  authMiddleware,
  // authRoleAdmin,
  deleteExpenseCategoryValidator,
  ExpenseCategoryController.deleteExpenseCategory
);

export default router;
