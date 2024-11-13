import express from 'express';
import ExpenseController from '../controllers/ExpenseController.js';
import {
  createExpenseValidator,
  updateExpenseValidator,
  deleteExpenseValidator,
} from '../validators/ExpenseValidator.js';
// import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();
router.post(
  '/expenses',
  // authMiddleware,
  createExpenseValidator,
  ExpenseController.createExpense
);
router.get('/expenses',
  //  authMiddleware,
  ExpenseController.getAllExpenses);
router.get('/expenses/:id',
  //  authMiddleware,
  ExpenseController.getExpenseById);
router.put(
  '/expenses/:id',
  // authMiddleware,
  updateExpenseValidator,
  ExpenseController.updateExpense
);
router.delete(
  '/expenses/:id',
  // authMiddleware,
  deleteExpenseValidator,
  ExpenseController.deleteExpense
);

export default router;
