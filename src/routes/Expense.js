import express from 'express';
import ExpenseController from '../controllers/ExpenseController.js';

const router = express.Router();
router.post('/expenses', ExpenseController.createExpense);
router.get('/expenses', ExpenseController.getAllExpenses);
router.get('/expenses/:id', ExpenseController.getExpenseById);
router.put('/expenses/:id', ExpenseController.updateExpense);
router.delete('/expenses/:id', ExpenseController.deleteExpense);

export default router;
