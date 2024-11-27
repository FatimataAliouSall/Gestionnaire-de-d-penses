import express from 'express';
import PaymentMethodController from '../controllers/PaymentMethodController.js';
import {
  createPaymentMethodValidator,
  updatePaymentMethodValidator,
  deletePaymentMethodValidator,
} from '../validators/PaymentMethodValidator.js';
import { authMiddleware } from '../middlewares/auth.js';
// import { authRoleAdmin } from '../middlewares/authRoleAdmin.js';

const router = express.Router();

router.post(
  '/payment-methods',
  authMiddleware,
  // authRoleAdmin,
  createPaymentMethodValidator,
  PaymentMethodController.createPaymentMethod
);
router.get(
  '/payment-methods',
  authMiddleware,
  // authRoleAdmin,
  PaymentMethodController.getAllPaymentMethods
);
router.get(
  '/payment-methods/:id',
  authMiddleware,
  // authRoleAdmin,
  PaymentMethodController.getPaymentMethodById
);
router.put(
  '/payment-methods/:id',
  authMiddleware,
  // authRoleAdmin,
  updatePaymentMethodValidator,
  PaymentMethodController.updatePaymentMethod
);
router.delete(
  '/payment-methods/:id',
  authMiddleware,
  // authRoleAdmin,
  deletePaymentMethodValidator,
  PaymentMethodController.deletePaymentMethod
);

export default router;
