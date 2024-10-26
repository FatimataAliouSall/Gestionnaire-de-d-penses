import express from 'express';
import ExpenseController from '../controllers/ExpenseController.js';
import {
  createExpenseValidator,
  updateExpenseValidator,
  deleteExpenseValidator,
} from '../validators/ExpenseValidator.js'; 

const router = express.Router();
router.post('/expenses', createExpenseValidator, ExpenseController.createExpense);
router.get('/expenses', ExpenseController.getAllExpenses);
router.get('/expenses/:id', ExpenseController.getExpenseById);
router.put('/expenses/:id', updateExpenseValidator, ExpenseController.updateExpense);
router.delete('/expenses/:id', deleteExpenseValidator, ExpenseController.deleteExpense);

export default router;
