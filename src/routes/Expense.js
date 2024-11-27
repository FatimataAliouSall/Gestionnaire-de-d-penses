import express from 'express';
import ExpenseController from '../controllers/ExpenseController.js';
import {
  createExpenseValidator,
  updateExpenseValidator,
  deleteExpenseValidator,
} from '../validators/ExpenseValidator.js';
import { authMiddleware } from '../middlewares/auth.js';
// import { authRoleAdmin } from '../middlewares/authRoleAdmin.js';

const router = express.Router();
router.post(
  '/expenses',
  authMiddleware,
  // authRoleAdmin,
  createExpenseValidator,
  ExpenseController.createExpense
);
router.get(
  '/expenses',
  authMiddleware,
  //  authRoleAdmin,
  ExpenseController.getAllExpenses
);
router.get(
  '/expenses/:id',
  authMiddleware,
  // authRoleAdmin,
  ExpenseController.getExpenseById
);
router.put(
  '/expenses/:id',
  authMiddleware,
  // authRoleAdmin,
  updateExpenseValidator,
  ExpenseController.updateExpense
);
router.delete(
  '/expenses/:id',
  authMiddleware,
  // authRoleAdmin,
  deleteExpenseValidator,
  ExpenseController.deleteExpense
);

export default router;
