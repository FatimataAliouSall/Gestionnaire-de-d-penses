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
const createExpenseCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage('Le nom de la catégorie est obligatoire.')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Le nom doit comporter au moins 3 caractères.')
    .bail()
    .custom(async (name, { req }) => {
      const existingCategory = await prisma.expenseCategory.findFirst({
        where: { name, userId: parseInt(req.body.userId, 10) },
      });
      if (existingCategory) {
        throw new Error('Une catégorie avec ce nom existe déjà.');
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
      const userExists = await prisma.user.findUnique({
        where: { id: parseInt(userId, 10) },
      });
      if (!userExists) {
        throw new Error('L\'utilisateur spécifié n\'existe pas.');
      }
    }),
  handleValidationErrors,
];
const updateExpenseCategoryValidator = [
  param('id')
    .notEmpty()
    .withMessage('L\'ID de la catégorie est requis.')
    .bail()
    .isInt()
    .withMessage('L\'ID doit être un nombre entier.')
    .bail()
    .custom(async (id) => {
      const categoryExists = await prisma.expenseCategory.findUnique({
        where: { id: parseInt(id, 10) },
      });
      if (!categoryExists) {
        throw new Error('Catégorie de dépense introuvable.');
      }
    }),
  check('name')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Le nom doit comporter au moins 3 caractères.')
    .bail()
    .custom(async (name, { req }) => {
      const { id, userId } = req.params;
      const existingCategory = await prisma.expenseCategory.findFirst({
        where: {
          name,
          userId: parseInt(userId, 10),
          id: { not: parseInt(id, 10) },
        },
      });
      if (existingCategory) {
        throw new Error('Une autre catégorie avec ce nom existe déjà.');
      }
    }),
  check('status')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Le statut doit être "true" ou "false".'),
  handleValidationErrors,
];
const deleteExpenseCategoryValidator = [
  param('id')
    .notEmpty()
    .withMessage('L\'ID de la catégorie est requis.')
    .bail()
    .isInt()
    .withMessage('L\'ID doit être un nombre entier.')
    .bail()
    .custom(async (id) => {
      const categoryExists = await prisma.expenseCategory.findUnique({
        where: { id: parseInt(id, 10) },
      });
      if (!categoryExists) {
        throw new Error('Catégorie de dépense introuvable.');
      }
    }),
  handleValidationErrors,
];

export {
  createExpenseCategoryValidator,
  updateExpenseCategoryValidator,
  deleteExpenseCategoryValidator,
};
