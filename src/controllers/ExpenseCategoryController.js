import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function parseUserId(userId) {
  const parsed = parseInt(userId, 10);
  return isNaN(parsed) ? null : parsed;
}

const ExpenseCategoryController = {
  async createExpenseCategory(req, res) {
    try {
      const { name, status, userId } = req.body;
      const parsedUserId = parseUserId(userId);

      if (parsedUserId) {
        const userExists = await prisma.user.findUnique({
          where: { id: parsedUserId },
        });
        if (!userExists) {
          return res.status(400).json({ message: req.t('userNotFound') });
        }
      }
      const existingCategory = await prisma.expenseCategory.findFirst({
        where: { name, userId: parsedUserId },
      });
      if (existingCategory) {
        return res.status(400).json({ message: req.t('categoryExists') });
      }

      const newCategory = await prisma.expenseCategory.create({
        data: { name, status, userId: parsedUserId },
      });

      return res
        .status(201)
        .json({ message: req.t('categoryCreated'), newCategory });
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie :', error);
      return res
        .status(500)
        .json({ error: req.t('categoryFetchError'), details: error.message });
    }
  },

  async getAllExpenseCategories(req, res) {
    try {
      const categories = await prisma.expenseCategory.findMany({
        include: { user: true, expenses: true },
      });
      return res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: req.t('categoryFetchError'), error });
    }
  },

  async getExpenseCategorieById(req, res) {
    try {
      const { id } = req.params;
      const category = await prisma.expenseCategory.findUnique({
        where: { id: parseUserId(id) },
      });
      if (!category) {
        return res.status(404).json({ message: req.t('categoryNotFound') });
      }
      return res.status(200).json(category);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: req.t('categoryFetchError'), details: error.message });
    }
  },

  async updateExpenseCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, status } = req.body;
      const parsedId = parseInt(id, 10);

      const categoryExists = await prisma.expenseCategory.findUnique({
        where: { id: parsedId },
      });
      if (!categoryExists) {
        return res.status(404).json({ message: req.t('categoryNotFound') });
      }

      const updatedCategory = await prisma.expenseCategory.update({
        where: { id: parsedId },
        data: { name, status },
      });

      return res
        .status(200)
        .json({ message: req.t('categoryUpdateSuccess'), updatedCategory });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie :', error);
      return res
        .status(500)
        .json({ error: req.t('categoryUpdateError'), details: error.message });
    }
  },

  async deleteExpenseCategory(req, res) {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id, 10);

      if (isNaN(parsedId)) {
        return res.status(400).json({ message: req.t('invalidId') });
      }
      const existingCategory = await prisma.expenseCategory.findUnique({
        where: { id: parsedId },
      });

      if (!existingCategory) {
        return res.status(404).json({ message: req.t('categoryNotFound') });
      }

      const deletedCategory = await prisma.expenseCategory.delete({
        where: { id: parsedId },
      });

      return res
        .status(200)
        .json({ message: req.t('categoryDeleteSuccess'), deletedCategory });
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie :', error);
      return res
        .status(500)
        .json({ error: req.t('categoryDeleteError'), details: error.message });
    }
  },
};

export default ExpenseCategoryController;
