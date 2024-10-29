import express from 'express';
import ExpenseCategoryController from '../controllers/ExpenseCategoryController.js';
import {
  createExpenseCategoryValidator,
  updateExpenseCategoryValidator,
  deleteExpenseCategoryValidator,
} from '../validators/ExpenseCategoryValidator.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.post(
  '/expense-categories',
  authMiddleware,
  createExpenseCategoryValidator,
  ExpenseCategoryController.createExpenseCategory
);
router.get(
  '/expense-categories/:id',
  authMiddleware,
  ExpenseCategoryController.getExpenseCategorieById
);
router.get(
  '/expense-categories',
  authMiddleware,
  ExpenseCategoryController.getAllExpenseCategories
);
router.put(
  '/expense-categories/:id',
  authMiddleware,
  updateExpenseCategoryValidator,
  ExpenseCategoryController.updateExpenseCategory
);
router.delete(
  '/expense-categories/:id',
  authMiddleware,
  deleteExpenseCategoryValidator,
  ExpenseCategoryController.deleteExpenseCategory
);

export default router;
