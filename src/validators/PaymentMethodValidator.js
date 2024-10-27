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
const createPaymentMethodValidator = [
  check('name')
    .notEmpty()
    .withMessage('Le nom du mode de paiement est obligatoire.')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Le nom doit comporter au moins 3 caractères.')
    .bail()
    .custom(async (name, { req }) => {
      const { userId } = req.body;
      const parsedUserId = parseInt(userId, 10);
      const existingPaymentMethod = await prisma.paymentMethod.findFirst({
        where: { name, userId: parsedUserId },
      });
      if (existingPaymentMethod) {
        throw new Error('Un mode de paiement avec ce nom existe déjà.');
      }
    }),
  check('status')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Le statut doit être "true" ou "false".'),
  check('userId')
    .notEmpty()
    .withMessage('L\'ID de l\'utilisateur est obligatoire.')
    .bail()
    .isInt()
    .withMessage('L\'ID de l\'utilisateur doit être un nombre entier.')
    .bail()
    .custom(async (userId) => {
      const parsedUserId = parseInt(userId, 10);
      const userExists = await prisma.user.findUnique({
        where: { id: parsedUserId },
      });
      if (!userExists) {
        throw new Error('L\'utilisateur spécifié n\'existe pas.');
      }
    }),
  handleValidationErrors,
];
const updatePaymentMethodValidator = [
  param('id')
    .notEmpty()
    .withMessage('L\'ID du mode de paiement est requis.')
    .bail()
    .isInt()
    .withMessage('L\'ID doit être un nombre entier.')
    .bail()
    .custom(async (id) => {
      const parsedId = parseInt(id, 10);
      const paymentMethodExists = await prisma.paymentMethod.findUnique({
        where: { id: parsedId },
      });
      if (!paymentMethodExists) {
        throw new Error('Mode de paiement introuvable.');
      }
    }),
  check('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Le nom doit comporter au moins 3 caractères.')
    .bail()
    .custom(async (name, { req }) => {
      const { id, userId } = req.params;
      const parsedUserId = parseInt(userId, 10);
      const existingPaymentMethod = await prisma.paymentMethod.findFirst({
        where: { name, userId: parsedUserId, id: { not: parseInt(id, 10) } },
      });
      if (existingPaymentMethod) {
        throw new Error('Un autre mode de paiement avec ce nom existe déjà.');
      }
    }),
  check('status')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Le statut doit être "true" ou "false".'),
  handleValidationErrors,
];
const deletePaymentMethodValidator = [
  param('id')
    .notEmpty()
    .withMessage('L\'ID du mode de paiement est requis.')
    .bail()
    .isInt()
    .withMessage('L\'ID doit être un nombre entier.')
    .bail()
    .custom(async (id) => {
      const parsedId = parseInt(id, 10);
      const paymentMethodExists = await prisma.paymentMethod.findUnique({
        where: { id: parsedId },
      });
      if (!paymentMethodExists) {
        throw new Error('Mode de paiement introuvable.');
      }
    }),
  handleValidationErrors,
];

export {
  createPaymentMethodValidator,
  updatePaymentMethodValidator,
  deletePaymentMethodValidator,
};
