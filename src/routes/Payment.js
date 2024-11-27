import express from 'express';
import PaymentController from '../controllers/PaymentController.js';
import {
  createPaymentValidator,
  updatePaymentValidator,
  deletePaymentValidator,
} from '../validators/PaymentValidator.js';
import { authMiddleware } from '../middlewares/auth.js';
// import { authRoleAdmin } from '../middlewares/authRoleAdmin.js';
const router = express.Router();

router.post(
  '/payments',
  authMiddleware,
  // authRoleAdmin,
  createPaymentValidator,
  PaymentController.createPayment
);

router.get(
  '/payments-requirements',
  authMiddleware,
  // authRoleAdmin,
  PaymentController.getRequirements
);

router.get('/payments', authMiddleware, 
  // authRoleAdmin, 
  PaymentController.getAllPayments);

router.get('/payments/:id', authMiddleware, 
  // authRoleAdmin, 
  PaymentController.getPaymentById);

router.put(
  '/payments/:id',
  authMiddleware,
  // authRoleAdmin,
  updatePaymentValidator,
  PaymentController.updatePayment
);

router.delete(
  '/payments/:id',
  authMiddleware,
  // authRoleAdmin,
  deletePaymentValidator,
  PaymentController.deletePayment
);

export default router;
