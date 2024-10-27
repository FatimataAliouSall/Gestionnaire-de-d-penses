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

const createUserValidator = [
  check('username')
    .notEmpty()
    .withMessage('Le nom d\'utilisateur est obligatoire.')
    .isLength({ min: 3, max: 30 })
    .withMessage(
      'Le nom d\'utilisateur doit comporter entre 3 et 30 caractères.'
    ),
  check('email')
    .isEmail()
    .withMessage('Veuillez fournir une adresse email valide.')
    .bail()
    .custom(async (value) => {
      const user = await prisma.user.findUnique({ where: { email: value } });
      if (user) {
        throw new Error('Cet email est déjà utilisé.');
      }
      return true;
    }),
  check('password')
    .notEmpty()
    .withMessage('Le mot de passe est obligatoire.')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit comporter au moins 6 caractères.'),
  check('status')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Le statut doit être soit "true" soit "false".'),
  handleValidationErrors,
];

const updateUserValidator = [
  param('id')
    .notEmpty()
    .withMessage('L\'ID de l\'utilisateur est requis.')
    .bail()
    .isInt()
    .withMessage('L\'ID doit être un nombre entier.')
    .bail()
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(value) },
      });
      if (!user) {
        throw new Error('L\'utilisateur n\'existe pas.');
      }
      return true;
    }),
  check('username')
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage(
      'Le nom d\'utilisateur doit comporter entre 3 et 30 caractères.'
    ),
  check('email')
    .optional()
    .isEmail()
    .withMessage('Veuillez fournir une adresse email valide.'),
  check('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit comporter au moins 6 caractères.'),
  check('status')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Le statut doit être soit "true" soit "false".'),
  handleValidationErrors,
];

const deleteUserValidator = [
  param('id')
    .notEmpty()
    .withMessage('L\'ID de l\'utilisateur est requis.')
    .bail()
    .isInt()
    .withMessage('L\'ID doit être un nombre entier.')
    .bail()
    .custom(async (value) => {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(value) },
      });
      if (!user) {
        throw new Error('L\'utilisateur n\'existe pas.');
      }
      return true;
    }),
  handleValidationErrors,
];

export { createUserValidator, updateUserValidator, deleteUserValidator };
