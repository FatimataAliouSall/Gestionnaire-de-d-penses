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

const createExpenseValidator = [
  check('title')
    .notEmpty()
    .withMessage('Le titre est obligatoire.')
    .bail()
    .isLength({ min: 3, max: 50 })
    .withMessage('Le titre doit comporter entre 3 et 50 caractères.'),
  check('amount')
    .notEmpty()
    .withMessage('Le montant est obligatoire.')
    .bail()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage(
      'Le montant doit être un nombre positif avec deux chiffres après la virgule maximum.'
    ),
  check('frequency')
    .optional()
    .isIn(['Mensuel', 'Annuel', 'Hebdomadaire'])
    .withMessage('La fréquence doit être \'Mensuel', 'Annuel', 'Hebdomadaire.'),
  check('startDate')
    .optional()
    .isISO8601()
    .withMessage('La date de début doit être une date valide (format ISO).'),
  check('endDate')
    .optional()
    .isISO8601()
    .withMessage('La date de fin doit être une date valide (format ISO).'),
  // check('userId')
  //   .optional()
  //   .isInt()
  //   .withMessage('L\'ID de l\'utilisateur doit être un nombre entier.')
  //   .bail()
  //   .custom(async (userId) => {
  //     const userExists = await prisma.user.findUnique({
  //       where: { id: parseInt(userId, 10) },
  //     });
  //     if (!userExists) {
  //       throw new Error('L\'utilisateur spécifié n\'existe pas.');
  //     }
  //   }),
  check('expenseCategoryId')
    .optional()
    .isInt()
    .withMessage('L\'ID de la catégorie de dépense doit être un nombre entier.')
    .bail()
    .custom(async (expenseCategoryId) => {
      const categoryExists = await prisma.expenseCategory.findUnique({
        where: { id: parseInt(expenseCategoryId, 10) },
      });
      if (!categoryExists) {
        throw new Error('La catégorie de dépense spécifiée n\'existe pas.');
      }
    }),
  handleValidationErrors,
];

const updateExpenseValidator = [
  param('id')
    .notEmpty()
    .withMessage('L\'ID de la dépense est requis.')
    .bail()
    .isInt()
    .withMessage('L\'ID doit être un nombre entier.')
    .bail()
    .custom(async (id) => {
      const expenseExists = await prisma.expense.findUnique({
        where: { id: parseInt(id, 10) },
      });
      if (!expenseExists) {
        throw new Error('Dépense introuvable.');
      }
    }),
  check('title')
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage('Le titre doit comporter entre 3 et 50 caractères.'),
  check('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le montant doit être un nombre positif.'),
  check('frequency')
    .optional()
    .isIn(['mensuel', 'annuel', 'hebdomadaire'])
    .withMessage('La fréquence doit être \'Mensuel', 'Annuel', 'Hebdomadaire.'),
  check('startDate')
    .optional()
    .isISO8601()
    .withMessage('La date de début doit être une date valide (format ISO).'),
  check('endDate')
    .optional()
    .isISO8601()
    .withMessage('La date de fin doit être une date valide (format ISO).'),
  // check('userId')
  //   .optional()
  //   .isInt()
  //   .withMessage('L\'ID de l\'utilisateur doit être un nombre entier.')
  //   .bail()
  //   .custom(async (userId) => {
  //     const userExists = await prisma.user.findUnique({
  //       where: { id: parseInt(userId, 10) },
  //     });
  //     if (!userExists) {
  //       throw new Error('L\'utilisateur spécifié n\'existe pas.');
  //     }
  //   }),
  check('expenseCategoryId')
    .optional()
    .isInt()
    .withMessage('L\'ID de la catégorie de dépense doit être un nombre entier.')
    .bail()
    .custom(async (expenseCategoryId) => {
      const categoryExists = await prisma.expenseCategory.findUnique({
        where: { id: parseInt(expenseCategoryId, 10) },
      });
      if (!categoryExists) {
        throw new Error('La catégorie de dépense spécifiée n\'existe pas.');
      }
    }),
  handleValidationErrors,
];

const deleteExpenseValidator = [
  param('id')
    .notEmpty()
    .withMessage('L\'ID de la dépense est requis.')
    .bail()
    .isInt()
    .withMessage('L\'ID doit être un nombre entier.')
    .bail()
    .custom(async (id) => {
      const expenseExists = await prisma.expense.findUnique({
        where: { id: parseInt(id, 10) },
      });
      if (!expenseExists) {
        throw new Error('Dépense introuvable.');
      }
    }),
  handleValidationErrors,
];

export {
  createExpenseValidator,
  updateExpenseValidator,
  deleteExpenseValidator,
};
