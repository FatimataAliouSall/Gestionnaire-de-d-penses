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
const createPlanningValidator = [
  check('name')
    .notEmpty()
    .withMessage('Le nom de la planification est obligatoire.')
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage('Le nom doit comporter entre 3 et 50 caractères.'),
  check('startDate')
    .notEmpty()
    .withMessage('La date de début est obligatoire.')
    .bail()
    .isISO8601()
    .withMessage(
      'La date de début doit être au format ISO8601 (ex. : \'YYYY-MM-DD)'
    ),
  check('endDate')
    .notEmpty()
    .withMessage('La date de fin est obligatoire.')
    .bail()
    .isISO8601()
    .withMessage(
      'La date de fin doit être au format ISO8601 (ex. : \'YYYY-MM-DD)'
    )
    .bail()
    .custom((endDate, { req }) => {
      const startDate = new Date(req.body.startDate);
      if (new Date(endDate) <= startDate) {
        throw new Error(
          'La date de fin doit être postérieure à la date de début.'
        );
      }
      return true;
    }),
  check('amount')
    .notEmpty()
    .withMessage('Le montant est obligatoire.')
    .bail()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage(
      'Le montant doit être un nombre positif avec deux chiffres après la virgule maximum.'
    ),
  check('expenseId')
    .optional()
    .isInt()
    .withMessage('L\'ID de la dépense doit être un entier valide.')
    .bail()
    .custom(async (expenseId) => {
      const expenseExists = await prisma.expense.findUnique({
        where: { id: parseInt(expenseId, 10) },
      });
      if (!expenseExists) {
        throw new Error('La dépense spécifiée n\'existe pas.');
      }
    }),
  handleValidationErrors,
];

const updatePlanningValidator = [
  param('id')
    .notEmpty()
    .withMessage('L\'ID de la planification est requis.')
    .bail()
    .isInt()
    .withMessage('L\'ID doit être un nombre entier.')
    .bail()
    .custom(async (id) => {
      const planningExists = await prisma.planning.findUnique({
        where: { id: parseInt(id, 10) },
      });
      if (!planningExists) {
        throw new Error('Planification introuvable.');
      }
    }),
  check('name')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('Le nom doit comporter entre 3 et 50 caractères.'),
  check('startDate')
    .optional()
    .isISO8601()
    .withMessage(
      'La date de début doit être au format ISO8601 (ex. : \'YYYY-MM-DD)'
    ),
  check('endDate')
    .optional()
    .isISO8601()
    .withMessage(
      'La date de fin doit être au format ISO8601 (ex. : \'YYYY-MM-DD)'
    )
    .bail()
    .custom((endDate, { req }) => {
      const startDate = new Date(req.body.startDate || req.existingStartDate);
      if (new Date(endDate) <= startDate) {
        throw new Error(
          'La date de fin doit être postérieure à la date de début.'
        );
      }
      return true;
    }),
  check('amount')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage(
      'Le montant doit être un nombre positif avec deux chiffres après la virgule maximum.'
    ),
  check('expenseId')
    .optional()
    .isInt()
    .withMessage('L\'ID de la dépense doit être un entier valide.')
    .bail()
    .custom(async (expenseId) => {
      const expenseExists = await prisma.expense.findUnique({
        where: { id: parseInt(expenseId, 10) },
      });
      if (!expenseExists) {
        throw new Error('La dépense spécifiée n\'existe pas.');
      }
    }),
  handleValidationErrors,
];

const deletePlanningValidator = [
  param('id')
    .notEmpty()
    .withMessage('L\'ID de la planification est requis.')
    .bail()
    .isInt()
    .withMessage('L\'ID doit être un nombre entier.')
    .bail()
    .custom(async (id) => {
      const planningExists = await prisma.planning.findUnique({
        where: { id: parseInt(id, 10) },
      });
      if (!planningExists) {
        throw new Error('Planification introuvable.');
      }
    }),
  handleValidationErrors,
];

export {
  createPlanningValidator,
  updatePlanningValidator,
  deletePlanningValidator,
};
