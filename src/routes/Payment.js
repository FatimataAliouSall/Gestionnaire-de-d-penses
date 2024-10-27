import express from 'express';
import PaymentController from '../controllers/PaymentController.js';
import {
  createPaymentValidator,
  updatePaymentValidator,
  deletePaymentValidator,
} from '../validators/PaymentValidator.js';

const router = express.Router();

// Route pour créer un paiement, avec validator
router.post(
  '/payments',
  createPaymentValidator,
  PaymentController.createPayment
);

// Route pour obtenir tous les paiements
router.get('/payments', PaymentController.getAllPayments);

// Route pour obtenir un paiement par ID
router.get('/payments/:id', PaymentController.getPaymentById);

// Route pour mettre à jour un paiement, avec validator
router.put(
  '/payments/:id',
  updatePaymentValidator,
  PaymentController.updatePayment
);

// Route pour supprimer un paiement, avec validator
router.delete(
  '/payments/:id',
  deletePaymentValidator,
  PaymentController.deletePayment
);

export default router;
