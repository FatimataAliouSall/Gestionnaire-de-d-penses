import express from 'express';
import PaymentController from '../controllers/PaymentController.js';
import {
  createPaymentValidator,
  updatePaymentValidator,
  deletePaymentValidator,
} from '../validators/PaymentValidator.js';
import { authMiddleware } from '../middlewares/auth.js';
const router = express.Router();

router.post(
  '/payments',
  authMiddleware,
  createPaymentValidator,
  PaymentController.createPayment
);

router.get('/payments', authMiddleware, PaymentController.getAllPayments);

router.get('/payments/:id', authMiddleware, PaymentController.getPaymentById);

router.put(
  '/payments/:id',
  authMiddleware,
  updatePaymentValidator,
  PaymentController.updatePayment
);

router.delete(
  '/payments/:id',
  authMiddleware,
  deletePaymentValidator,
  PaymentController.deletePayment
);

export default router;
