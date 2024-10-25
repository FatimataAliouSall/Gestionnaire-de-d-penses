import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function parseId(id) {
  const parsed = parseInt(id, 10);
  return isNaN(parsed) ? null : parsed;
}

const ExpenseController = {
    async createExpense(req, res) {
        try {
          const { title, amount, frequency, startDate, endDate, userId, expenseCategoryId } = req.body;
          const parsedUserId = parseId(userId);
      
          // Vérification de l'existence de l'utilisateur
          if (parsedUserId) {
            const userExists = await prisma.user.findUnique({
              where: { id: parsedUserId },
            });
            if (!userExists) {
              return res.status(400).json({ message: "L'utilisateur spécifié n'existe pas" });
            }
          }
      
          // Vérification de l'existence de la catégorie de dépense
          if (expenseCategoryId) {
            const categoryExists = await prisma.expenseCategory.findUnique({
              where: { id: expenseCategoryId },
            });
            if (!categoryExists) {
              return res.status(400).json({ message: "La catégorie de dépense spécifiée n'existe pas" });
            }
          }
      
          // Création de la dépense
          const newExpense = await prisma.expense.create({
            data: {
              title,
              amount,
              frequency,
              dateCreate: new Date(),
              startDate: new Date(startDate),
              endDate: new Date(endDate),
              userId: parsedUserId || null, // Définit à null si parsedUserId est invalide
              expenseCategoryId: expenseCategoryId || null, // Définit à null si expenseCategoryId est invalide
            },
          });
      
          return res.status(201).json({ message: 'Dépense créée avec succès', newExpense });
        } catch (error) {
          console.error('Erreur lors de la création de la dépense :', error);
          return res.status(500).json({ error: 'Erreur lors de la création de la dépense', details: error.message });
        }
      },
  async getAllExpenses(req, res) {
    try {
      const expenses = await prisma.expense.findMany({
        include: {
          user: true,
          category: true,
          plannings: true,
          payments: true,
        },
      });
      return res.status(200).json(expenses);
    } catch (error) {
      console.error('Erreur lors de la récupération des dépenses :', error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des dépenses', error });
    }
  },

  // Récupérer une dépense par ID
  async getExpenseById(req, res) {
    try {
      const { id } = req.params;
      const parsedId = parseId(id);

      if (parsedId === null) {
        return res.status(400).json({ message: "ID invalide pour la dépense" });
      }

      const expense = await prisma.expense.findUnique({
        where: { id: parsedId },
      });
      if (!expense) {
        return res.status(404).json({ message: 'Dépense non trouvée' });
      }
      return res.status(200).json(expense);
    } catch (error) {
      console.error('Erreur lors de la récupération de la dépense :', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération de la dépense', details: error.message });
    }
  },

  // Mettre à jour une dépense par ID
  async updateExpense(req, res) {
    try {
      const { id } = req.params;
      const { title, amount, frequency, startDate, endDate, userId, expenseCategoryId } = req.body;
      const parsedId = parseId(id);
  
      if (parsedId === null) {
        return res.status(400).json({ message: "ID invalide pour la dépense" });
      }
  
      // Vérification de l'existence de la dépense
      const expenseExists = await prisma.expense.findUnique({
        where: { id: parsedId },
      });
      if (!expenseExists) {
        return res.status(404).json({ message: "Dépense introuvable" });
      }
  
      // Vérification de l'existence de l'utilisateur
      if (userId) {
        const userExists = await prisma.user.findUnique({
          where: { id: parseId(userId) },
        });
        if (!userExists) {
          return res.status(400).json({ message: "L'utilisateur spécifié n'existe pas" });
        }
      }
  
      // Vérification de l'existence de la catégorie de dépense
      if (expenseCategoryId) {
        const categoryExists = await prisma.expenseCategory.findUnique({
          where: { id: expenseCategoryId },
        });
        if (!categoryExists) {
          return res.status(400).json({ message: "La catégorie de dépense spécifiée n'existe pas" });
        }
      }
  
      // Mise à jour de la dépense
      const updatedExpense = await prisma.expense.update({
        where: { id: parsedId },
        data: {
          title,
          amount,
          frequency,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          userId: parseId(userId) || null, // Définit à null si userId est invalide
          expenseCategoryId: expenseCategoryId || null, // Définit à null si expenseCategoryId est invalide
        },
      });
  
      return res.status(200).json({ message: 'Dépense mise à jour avec succès', updatedExpense });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la dépense :', error);
      return res.status(500).json({ error: 'Erreur lors de la mise à jour de la dépense', details: error.message });
    }
  },

  async deleteExpense(req, res) {
    try {
      const { id } = req.params;
      const parsedId = parseId(id);

      if (parsedId === null) {
        return res.status(400).json({ message: "ID invalide pour la dépense" });
      }

      const existingExpense = await prisma.expense.findUnique({
        where: { id: parsedId },
      });

      if (!existingExpense) {
        return res.status(404).json({ message: 'Dépense non trouvée' });
      }

      const deletedExpense = await prisma.expense.delete({
        where: { id: parsedId },
      });

      return res.status(200).json({ message: 'Dépense supprimée avec succès', deletedExpense });
    } catch (error) {
      console.error('Erreur lors de la suppression de la dépense :', error);
      return res.status(500).json({ error: 'Erreur lors de la suppression de la dépense', details: error.message });
    }
  }
};

export default ExpenseController;
