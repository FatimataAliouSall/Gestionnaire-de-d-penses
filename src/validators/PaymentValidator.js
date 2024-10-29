import { check, param, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ errors: errors.array() });
  }
  next();
};

const createPaymentValidator = [
  check('amount')
    .notEmpty()
    .withMessage('Le montant est obligatoire.')
    .bail()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage(
      'Le montant doit être un nombre positif avec deux chiffres après la virgule maximum.'
    ),
  check('paymentDate')
    .notEmpty()
    .withMessage('La date de paiement est obligatoire.')
    .bail()
    .isISO8601()
    .withMessage('La date de paiement doit être une date valide (format ISO).'),
  check('userId')
    .notEmpty()
    .withMessage('L\'ID de l\'utilisateur est obligatoire.')
    .bail()
    .isInt()
    .withMessage('L\'ID de l\'utilisateur doit être un nombre entier.')
    .bail()
    .custom(async (userId) => {
      const userExists = await prisma.user.findUnique({
        where: { id: parseInt(userId, 10) },
      });
      if (!userExists) {
        throw new Error('L\'utilisateur spécifié n\'existe pas.');
      }
    }),
  check('paymentMethodId')
    .optional()
    .isInt()
    .withMessage('L\'ID du mode de paiement doit être un nombre entier.')
    .bail()
    .custom(async (paymentMethodId) => {
      const methodExists = await prisma.paymentMethod.findUnique({
        where: { id: parseInt(paymentMethodId, 10) },
      });
      if (!methodExists) {
        throw new Error('Le mode de paiement spécifié n\'existe pas.');
      }
    }),
  handleValidationErrors,
];
const updatePaymentValidator = [
  param('id')
    .notEmpty()
    .withMessage('L\'ID du paiement est requis.')
    .bail()
    .isInt()
    .withMessage('L\'ID doit être un nombre entier.')
    .bail()
    .custom(async (id) => {
      const paymentExists = await prisma.payment.findUnique({
        where: { id: parseInt(id, 10) },
      });
      if (!paymentExists) {
        throw new Error('Paiement introuvable.');
      }
    }),
  check('amount')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage(
      'Le montant doit être un nombre positif avec deux chiffres après la virgule maximum.'
    ),
  check('paymentDate')
    .optional()
    .isISO8601()
    .withMessage('La date de paiement doit être une date valide (format ISO).'),
  check('userId')
    .optional()
    .isInt()
    .withMessage('L\'ID de l\'utilisateur doit être un nombre entier.')
    .bail()
    .custom(async (userId) => {
      const userExists = await prisma.user.findUnique({
        where: { id: parseInt(userId, 10) },
      });
      if (!userExists) {
        throw new Error('L\'utilisateur spécifié n\'existe pas.');
      }
    }),
  check('paymentMethodId')
    .optional()
    .isInt()
    .withMessage('L\'ID du mode de paiement doit être un nombre entier.')
    .bail()
    .custom(async (paymentMethodId) => {
      const methodExists = await prisma.paymentMethod.findUnique({
        where: { id: parseInt(paymentMethodId, 10) },
      });
      if (!methodExists) {
        throw new Error('Le mode de paiement spécifié n\'existe pas.');
      }
    }),
  handleValidationErrors,
];

const deletePaymentValidator = [
  param('id')
    .notEmpty()
    .withMessage('L\'ID du paiement est requis.')
    .bail()
    .isInt()
    .withMessage('L\'ID doit être un nombre entier.')
    .bail()
    .custom(async (id) => {
      const paymentExists = await prisma.payment.findUnique({
        where: { id: parseInt(id, 10) },
      });
      if (!paymentExists) {
        throw new Error('Paiement introuvable.');
      }
    }),
  handleValidationErrors,
];

export {
  createPaymentValidator,
  updatePaymentValidator,
  deletePaymentValidator,
};
