import express from 'express';
import ExpenseCategoryController from '../controllers/ExpenseCategoryController.js'; 
import {
    createExpenseCategoryValidator,
    updateExpenseCategoryValidator,
    deleteExpenseCategoryValidator,
  } from "../validators/ExpenseCategoryValidator.js";

const router = express.Router();

// Routes pour les catégories de dépenses
router.post('/expense-categories',createExpenseCategoryValidator, ExpenseCategoryController.createExpenseCategory);
router.get('/expense-categories/:id', ExpenseCategoryController.getExpenseCategorieById);
router.get('/expense-categories', ExpenseCategoryController.getAllExpenseCategories);
// router.get('/users/:userId/expense-categories', ExpenseCategoryController.getAllExpenseCategories);
router.put('/expense-categories/:id',updateExpenseCategoryValidator, ExpenseCategoryController.updateExpenseCategory);
router.delete('/expense-categories/:id',deleteExpenseCategoryValidator, ExpenseCategoryController.deleteExpenseCategory);

export default router;
