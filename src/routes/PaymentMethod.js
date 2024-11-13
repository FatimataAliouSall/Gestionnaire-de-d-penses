import express from 'express';
import PaymentMethodController from '../controllers/PaymentMethodController.js';
import {
  createPaymentMethodValidator,
  updatePaymentMethodValidator,
  deletePaymentMethodValidator,
} from '../validators/PaymentMethodValidator.js';
// import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router.post(
  '/payment-methods',
  // authMiddleware,
  createPaymentMethodValidator,
  PaymentMethodController.createPaymentMethod
);
router.get(
  '/payment-methods',
  // authMiddleware,
  PaymentMethodController.getAllPaymentMethods
);
router.get(
  '/payment-methods/:id',
  // authMiddleware,
  PaymentMethodController.getPaymentMethodById
);
router.put(
  '/payment-methods/:id',
  // authMiddleware,
  updatePaymentMethodValidator,
  PaymentMethodController.updatePaymentMethod
);
router.delete(
  '/payment-methods/:id',
  // authMiddleware,
  deletePaymentMethodValidator,
  PaymentMethodController.deletePaymentMethod
);

export default router;
