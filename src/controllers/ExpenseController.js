import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function parseId(id) {
  const parsed = parseInt(id);
  return isNaN(parsed) ? null : parsed;
}

const ExpenseController = {
  async createExpense(req, res) {
    try {
      const {
        title,
        // userId,
        expenseCategoryId,
      } = req.body;
      // const parsedUserId = parseUserId(userId);
      // if (parsedUserId) {
      //   const userExists = await prisma.user.findUnique({
      //     where: { id: parsedUserId },
      //   });
      //   if (!userExists) {
      //     return res
      //       .status(400)
      //       .json({ message: 'L\'utilisateur spécifié n\'existe pas' });
      //   }
      // }

      if (!expenseCategoryId) {
        return res.status(400).json({
          message: 'L\'ID de la catégorie de dépense est requis',
        });
      }

      const parsedExpenseCategoryId = parseId(expenseCategoryId);
      if (parsedExpenseCategoryId === null) {
        return res.status(400).json({
          message: 'L\'ID de la catégorie de dépense est invalide',
        });
      }

      const categoryExists = await prisma.expenseCategory.findUnique({
        where: { id: parsedExpenseCategoryId },
      });

      if (!categoryExists) {
        return res.status(400).json({
          message: 'La catégorie de dépense spécifiée n\'existe pas',
        });
      }

      const newExpense = await prisma.expense.create({
        data: {
          title,
          dateCreate: new Date(),
          // userId: parsedUserId || null,
          expenseCategoryId: parsedExpenseCategoryId,
        },
      });

      return res
        .status(201)
        .json({ message: 'Dépense créée avec succès', newExpense });
    } catch (error) {
      console.error('Erreur lors de la création de la dépense :', error);
      return res.status(500).json({
        error: 'Erreur lors de la création de la dépense',
        details: error.message,
      });
    }
  },
  async getAllExpenses(req, res) {
    try {
      const expenses = await prisma.expense.findMany({
        include: {
          user: { select : { username : true}} ,
          category: { select : { name : true}},
          // plannings: { select : { name : true}},
          // payments: { select : { name : true}},
        },
      });
      return res.status(200).json(expenses);
    } catch (error) {
      console.error('Erreur lors de la récupération des dépenses :', error);
      return res.status(500).json({
        message: 'Erreur lors de la récupération des dépenses',
        error,
      });
    }
  },
  async getExpenseById(req, res) {
    try {
      const { id } = req.params;
      const parsedId = parseId(id);

      if (parsedId === null) {
        return res.status(400).json({ message: 'ID invalide pour la dépense' });
      }

      const expense = await prisma.expense.findUnique({
        where: { id: parsedId },
        include: {
          user: { select: { username: true } },
          category: { select: { name: true } },
        },
      });

      if (!expense) {
        return res.status(404).json({ message: 'Dépense non trouvée' });
      }
      return res.status(200).json(expense);
    } catch (error) {
      console.error('Erreur lors de la récupération de la dépense :', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération de la dépense',
        details: error.message,
      });
    }
  },
  async updateExpense(req, res) {
    try {
      const { id } = req.params;
      const {
        title,
        // userId,
        expenseCategoryId,
      } = req.body;
      const parsedId = parseId(id);

      if (parsedId === null) {
        return res.status(400).json({ message: 'ID invalide pour la dépense' });
      }
      const expenseExists = await prisma.expense.findUnique({
        where: { id: parsedId },
      });
      if (!expenseExists) {
        return res.status(404).json({ message: 'Dépense introuvable' });
      }
      let parsedExpenseCategoryId = null;
      if (expenseCategoryId) {
        parsedExpenseCategoryId = parseId(expenseCategoryId);
        if (parsedExpenseCategoryId === null) {
          return res.status(400).json({
            message: 'L\'ID de la catégorie de dépense est invalide',
          });
        }

        const categoryExists = await prisma.expenseCategory.findUnique({
          where: { id: parsedExpenseCategoryId },
        });

        if (!categoryExists) {
          return res.status(400).json({
            message: 'La catégorie de dépense spécifiée n\'existe pas',
          });
        }
      }

      // Mise à jour de la dépense
      const updatedExpense = await prisma.expense.update({
        where: { id: parsedId },
        data: {
          title,
          // userId: parseId(userId) || null,
          expenseCategoryId: parsedExpenseCategoryId || expenseExists.expenseCategoryId,
        },
      });

      return res
        .status(200)
        .json({ message: 'Dépense mise à jour avec succès', updatedExpense });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la dépense :', error);
      return res.status(500).json({
        error: 'Erreur lors de la mise à jour de la dépense',
        details: error.message,
      });
    }
  },

  async deleteExpense(req, res) {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id, 10);
  
      if (isNaN(parsedId)) {
        return res.status(400).json({ message: 'ID invalide pour la dépense' });
      }
  
      // Vérifiez si la dépense existe
      const existingExpense = await prisma.expense.findUnique({
        where: { id: parsedId },
      });
  
      if (!existingExpense) {
        return res.status(404).json({ message: 'Dépense non trouvée' });
      }
  
      // Essayez de supprimer la dépense
      try {
        const deletedExpense = await prisma.expense.delete({
          where: { id: parsedId },
        });
  
        return res
          .status(200)
          .json({ message: 'Dépense supprimée avec succès', deletedExpense });
      } catch (error) {
        // Gérer l'erreur de contrainte de clé étrangère
        if (error.code === 'P2003') {
          return res.status(409).json({
            message: 'Impossible de supprimer la dépense car elle est liée à d\'autres enregistrements.',
            suggestion: 'Veuillez supprimer ou modifier ces enregistrements liés avant de réessayer.',
          });
        }
  
        // Si c'est une autre erreur, la gérer normalement
        throw error;
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la dépense :', error);
      return res.status(500).json({
        error: 'Erreur lors de la suppression de la dépense',
        details: error.message,
      });
    }
  },
  


};

export default ExpenseController;
