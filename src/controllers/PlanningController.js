import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function parseId(id) {
  const parsed = parseInt(id, 10);
  return isNaN(parsed) ? null : parsed;
}

const PlanningController = {
  async createPlanning(req, res) {
    try {
      const { name, startDate, endDate, dueDate, amount, unit, expenseId } = req.body;
  
     
      // if (!name || !startDate || !endDate || !dueDate || !amount || !unit) {
      //   return res.status(400).json({ 
      //     message: 'Tous les champs obligatoires doivent être fournis : name, startDate, endDate, dueDate, amount, unit' 
      //   });
      // }
  
      // Vérifiez que expenseId est fourni
      if (!expenseId) {
        return res.status(400).json({ message: 'L\'ID de la dépense est requis' });
      }
  
      const parsedExpenseId = parseId(expenseId);
      if (parsedExpenseId === null) {
        return res.status(400).json({ message: 'L\'ID de la dépense est invalide'});
      }
  
      const expenseExists = await prisma.expense.findUnique({
        where: { id: parsedExpenseId },
      });
  
      if (!expenseExists) {
        return res.status(400).json({ message: 'L\a dépense spécifiée n\'existe pas'});
      }
  
      const newPlanning = await prisma.planning.create({
        data: {
          name,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          dueDate: new Date(dueDate),
          amount,
          unit,
          expenseId: parsedExpenseId,
        },
      });
  
      return res.status(201).json({ 
        message: 'Planification créée avec succès', 
        newPlanning 
      });
    } catch (error) {
      console.error('Erreur lors de la création de la planification :', error);
      return res.status(500).json({
        error: 'Erreur lors de la création de la planification',
        details: error.message,
      });
    }
  },


  async getAllPlannings(req, res) {
    try {
      const plannings = await prisma.planning.findMany({
        include: {
          expense: { select : { title : true}},
          // payments: { select : { name : true}},
        },
      });
      return res.status(200).json(plannings);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des planifications :',
        error
      );
      return res.status(500).json({
        message: 'Erreur lors de la récupération des planifications',
        error,
      });
    }
  },

  async getPlanningById(req, res) {
    try {
      const { id } = req.params;
      const parsedId = parseId(id);

      if (parsedId === null) {
        return res
          .status(400)
          .json({ message: 'ID invalide pour la planification' });
      }

      const planning = await prisma.planning.findUnique({
        where: { id: parsedId },
        include: { expense: { select : { title : true}},
        //  payments: { select : { name : true}} 
        },
      });
      if (!planning) {
        return res.status(404).json({ message: 'Planification non trouvée' });
      }
      return res.status(200).json(planning);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération de la planification :',
        error
      );
      return res.status(500).json({
        error: 'Erreur lors de la récupération de la planification',
        details: error.message,
      });
    }
  },

  async updatePlanning(req, res) {
    try {
      const { id } = req.params;
      const { name, startDate, endDate, dueDate, amount,unit , expenseId } = req.body;
      const parsedId = parseId(id);

      if (parsedId === null) {
        return res
          .status(400)
          .json({ message: 'ID invalide pour la planification' });
      }
      const planningExists = await prisma.planning.findUnique({
        where: { id: parsedId },
      });
      if (!planningExists) {
        return res.status(404).json({ message: 'Planification introuvable' });
      }
      let parsedexpenseId = null;
      if (expenseId) {
        parsedexpenseId = parseId(expenseId);
        if (parsedexpenseId === null) {
          return res.status(400).json({
            message: 'L\'ID de la dépense est invalide',
          });
        }
        const expenseExists = await prisma.expense.findUnique({
          where: { id: parsedexpenseId },
        });
        if (!expenseExists) {
          return res
            .status(400)
            .json({ message: 'La dépense spécifiée n\'existe pas' });
        }
      }
      const updatedPlanning = await prisma.planning.update({
        where: { id: parsedId },
        data: {
          name,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          dueDate: new Date(dueDate),
          amount,
          unit,
          expenseId: parsedexpenseId || expenseExists.expenseId,
        },
      });

      return res.status(200).json({
        message: 'Planification mise à jour avec succès',
        updatedPlanning,
      });
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour de la planification :',
        error
      );
      return res.status(500).json({
        error: 'Erreur lors de la mise à jour de la planification',
        details: error.message,
      });
    }
  },

  async deletePlanning(req, res) {
    try {
      const { id } = req.params;
      const parsedId = parseInt(id, 10);

      if (isNaN(parsedId)){
        return res
          .status(400)
          .json({ message: 'ID invalide pour la planification' });
      }

      const existingPlanning = await prisma.planning.findUnique({
        where: { id: parsedId },
      });

      if (!existingPlanning) {
        return res.status(404).json({ message: 'Planification non trouvée' });
      }

      const deletedPlanning = await prisma.planning.delete({
        where: { id: parsedId },
      });

      return res.status(200).json({
        message: 'Planification supprimée avec succès',
        deletedPlanning,
      });
    } catch (error) {
      console.error(
        'Erreur lors de la suppression de la planification :',
        error
      );
      return res.status(500).json({
        error: 'Erreur lors de la suppression de la planification',
        details: error.message,
      });
    }
  },
};

export default PlanningController;
