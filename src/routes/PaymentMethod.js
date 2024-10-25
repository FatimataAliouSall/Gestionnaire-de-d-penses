import express from 'express';
import PaymentMethodController from '../controllers/PaymentMethodController.js';

const router = express.Router();

router.post('/payment-methods', PaymentMethodController.createPaymentMethod);
router.get('/payment-methods', PaymentMethodController.getAllPaymentMethods);
router.get('/payment-methods/:id', PaymentMethodController.getPaymentMethodById);
router.put('/payment-methods/:id', PaymentMethodController.updatePaymentMethod);
router.delete('/payment-methods/:id', PaymentMethodController.deletePaymentMethod);

export default router;
