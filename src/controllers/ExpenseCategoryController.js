import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function parseUserId(userId) {
  const parsed = parseInt(userId);
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
          return res.status(400).json({ message: 'L\'utilisateur spécifié n\'existe pas' });
        }
      }
      const existingCategory = await prisma.expenseCategory.findFirst({
        where: { name, userId: parsedUserId },
      });
      if (existingCategory) {
        return res.status(400).json({ message: 'cette catégory avec ce nom existe déjà'});
      }

      const newCategory = await prisma.expenseCategory.create({
        data: { name, status, userId: parsedUserId },
      });

      return res
        .status(201)
        .json({ message:'Catégorie créé avec succès', newCategory });
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie :', error);
      return res
        .status(500)
        .json({ error: 'Erreur lors de la création de catégorie', details: error.message });
    }
  },

  async getAllExpenseCategories(req, res) {
    try {
      const category = await prisma.expenseCategory.findMany({
        include: { user: { select : { username : true}}, expenses: { select : { title : true}} },
      });
      return res.status(200).json(category);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: 'Erreur lors de la récupération des catégories', error });
    }
  },

  async getExpenseCategorieById(req, res) {
    try {
      const { id } = req.params;
      const category = await prisma.expenseCategory.findUnique({
        where: { id: parseInt(id) }, 
        include: {
          user: {
            select: {
              username: true,
            },
          },
          expenses: {
            select: {
              title: true,
            },
          },
        },
      });
  
      if (!category) {
        return res.status(404).json({ message: 'Catégorie non trouvée' });
      }
  
      return res.status(200).json(category);
    } catch (error) {
      console.error('Erreur lors de la récupération de la catégorie de dépense :', error);
      return res
        .status(500)
        .json({ error: 'Erreur lors de la récupération de la catégorie', details: error.message });
    }
  },
  

  async updateExpenseCategory(req, res) {
    try {
      const { id } = req.params;
      const { name, status } = req.body;
      const parsedId = parseUserId(id);
      if (parsedId === null) {
        return res
          .status(400)
          .json({ message: 'ID invalide pour la catégorie' });
      }

      const categoryExists = await prisma.expenseCategory.findUnique({
        where: { id: parsedId },
      });
      if (!categoryExists) {
        return res.status(404).json({ message:'Catégorie introuvable' });
      }

      const updatedCategory = await prisma.expenseCategory.update({
        where: { id: parsedId },
        data: { name, status },
      });

      return res
        .status(200)
        .json({ message: 'Catégorie mis à jour avec succès', updatedCategory });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie :', error);
      return res
        .status(500)
        .json({ error: 'Erreur lors de la mise à jour de catégorie', details: error.message });
    }
  },

  async deleteExpenseCategory(req, res) {
    try {
      const { id } = req.params;
      const parsedId = parseUserId(id);
  
      if (parsedId === null) {
        return res.status(400).json({ message: 'ID invalide pour la catégorie' });
      }
  
      const existingCategory = await prisma.expenseCategory.findUnique({
        where: { id: parsedId },
      });
  
      if (!existingCategory) {
        return res.status(404).json({ message: 'Catégorie non trouvée' });
      }
  
      // Vérifiez si des dépenses sont liées à cette catégorie
      const relatedExpenses = await prisma.expense.findMany({
        where: { expenseCategoryId: parsedId },
      });
  
      if (relatedExpenses.length > 0) {
        return res.status(400).json({
          message: `Impossible de supprimer la catégorie. Elle est associée à ${relatedExpenses.length} dépense(s).`,
        });
      }
      const deletedCategory = await prisma.expenseCategory.delete({
        where: { id: parsedId },
      });
  
      return res
        .status(200)
        .json({ message: 'Catégorie supprimée avec succès', deletedCategory });
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie :', error);
  
      if (error.code === 'P2003') {
        return res.status(400).json({
          message: 'Impossible de supprimer la catégorie en raison de dépendances liées.',
        });
      }
  
      return res.status(500).json({
        error: 'Erreur lors de la suppression de catégorie',
        details: error.message,
      });
    }
  },
};

export default ExpenseCategoryController;
