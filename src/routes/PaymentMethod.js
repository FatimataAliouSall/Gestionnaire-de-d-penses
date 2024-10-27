import express from 'express';
import PaymentMethodController from '../controllers/PaymentMethodController.js';
import {
  createPaymentMethodValidator,
  updatePaymentMethodValidator,
  deletePaymentMethodValidator,
} from '../validators/PaymentMethodValidator.js';

const router = express.Router();

router.post(
  '/payment-methods',
  createPaymentMethodValidator,
  PaymentMethodController.createPaymentMethod
);
router.get('/payment-methods', PaymentMethodController.getAllPaymentMethods);
router.get(
  '/payment-methods/:id',
  PaymentMethodController.getPaymentMethodById
);
router.put(
  '/payment-methods/:id',
  updatePaymentMethodValidator,
  PaymentMethodController.updatePaymentMethod
);
router.delete(
  '/payment-methods/:id',
  deletePaymentMethodValidator,
  PaymentMethodController.deletePaymentMethod
);

export default router;
