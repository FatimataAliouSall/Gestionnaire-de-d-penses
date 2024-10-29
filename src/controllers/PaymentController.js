import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function parseId(id) {
  const parsed = parseInt(id, 10);
  return isNaN(parsed) ? null : parsed;
}

const PaymentController = {
  async createPayment(req, res) {
    try {
      const {
        amount,
        paymentDate,
        reference,
        userId,
        planningId,
        paymentMethodId,
        expenseId,
      } = req.body;
      const parsedUserId = parseId(userId);
      const parsedPlanningId = parseId(planningId);
      const parsedPaymentMethodId = parseId(paymentMethodId);
      const parsedExpenseId = parseId(expenseId);
      const userExists = parsedUserId
        ? await prisma.user.findUnique({ where: { id: parsedUserId } })
        : null;
      const planningExists = parsedPlanningId
        ? await prisma.planning.findUnique({ where: { id: parsedPlanningId } })
        : null;
      const paymentMethodExists = parsedPaymentMethodId
        ? await prisma.paymentMethod.findUnique({
          where: { id: parsedPaymentMethodId },
        })
        : null;
      const expenseExists = parsedExpenseId
        ? await prisma.expense.findUnique({ where: { id: parsedExpenseId } })
        : null;

      if (!userExists)
        return res
          .status(400)
          .json({ message: 'L\'utilisateur spécifié n\'existe pas' });
      if (!planningExists)
        return res
          .status(400)
          .json({ message: 'La planification spécifiée n\'existe pas' });
      if (!paymentMethodExists)
        return res
          .status(400)
          .json({ message: 'La méthode de paiement spécifiée n\'existe pas' });
      if (!expenseExists)
        return res
          .status(400)
          .json({ message: 'La dépense spécifiée n\'existe pas' });
      const newPayment = await prisma.payment.create({
        data: {
          amount,
          paymentDate: new Date(paymentDate),
          reference,
          userId: parsedUserId,
          planningId: parsedPlanningId,
          paymentMethodId: parsedPaymentMethodId,
          expenseId: parsedExpenseId,
        },
      });

      return res
        .status(201)
        .json({ message: 'Paiement créé avec succès', newPayment });
    } catch (error) {
      console.error('Erreur lors de la création du paiement :', error);
      return res.status(500).json({
        error: 'Erreur lors de la création du paiement',
        details: error.message,
      });
    }
  },
  async getAllPayments(req, res) {
    try {
      const payments = await prisma.payment.findMany({
        include: {
          user: true,
          planning: true,
          paymentMethod: true,
          expense: true,
        },
      });
      return res.status(200).json(payments);
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements :', error);
      return res.status(500).json({
        message: 'Erreur lors de la récupération des paiements',
        error,
      });
    }
  },
  async getPaymentById(req, res) {
    try {
      const { id } = req.params;
      const parsedId = parseId(id);

      if (parsedId === null) {
        return res
          .status(400)
          .json({ message: 'ID invalide pour le paiement' });
      }

      const payment = await prisma.payment.findUnique({
        where: { id: parsedId },
        include: {
          user: true,
          planning: true,
          paymentMethod: true,
          expense: true,
        },
      });

      if (!payment) {
        return res.status(404).json({ message: 'Paiement non trouvé' });
      }

      return res.status(200).json(payment);
    } catch (error) {
      console.error('Erreur lors de la récupération du paiement :', error);
      return res.status(500).json({
        error: 'Erreur lors de la récupération du paiement',
        details: error.message,
      });
    }
  },

  async updatePayment(req, res) {
    try {
      const { id } = req.params;
      const {
        amount,
        paymentDate,
        reference,
        userId,
        planningId,
        paymentMethodId,
        expenseId,
      } = req.body;
      const parsedId = parseId(id);

      if (parsedId === null) {
        return res
          .status(400)
          .json({ message: 'ID invalide pour le paiement' });
      }

      const paymentExists = await prisma.payment.findUnique({
        where: { id: parsedId },
      });
      if (!paymentExists)
        return res.status(404).json({ message: 'Paiement introuvable' });

      const userExists = userId
        ? await prisma.user.findUnique({ where: { id: parseId(userId) } })
        : null;
      const planningExists = planningId
        ? await prisma.planning.findUnique({
          where: { id: parseId(planningId) },
        })
        : null;
      const paymentMethodExists = paymentMethodId
        ? await prisma.paymentMethod.findUnique({
          where: { id: parseId(paymentMethodId) },
        })
        : null;
      const expenseExists = expenseId
        ? await prisma.expense.findUnique({ where: { id: parseId(expenseId) } })
        : null;

      if (userId && !userExists)
        return res
          .status(400)
          .json({ message: 'L\'utilisateur spécifié n\'existe pas' });
      if (planningId && !planningExists)
        return res
          .status(400)
          .json({ message: 'La planification spécifiée n\'existe pas' });
      if (paymentMethodId && !paymentMethodExists)
        return res
          .status(400)
          .json({ message: 'La méthode de paiement spécifiée n\'existe pas' });
      if (expenseId && !expenseExists)
        return res
          .status(400)
          .json({ message: 'La dépense spécifiée n\'existe pas' });

      const updatedPayment = await prisma.payment.update({
        where: { id: parsedId },
        data: {
          amount,
          paymentDate: new Date(paymentDate),
          reference,
          userId: parseId(userId) || null,
          planningId: parseId(planningId) || null,
          paymentMethodId: parseId(paymentMethodId) || null,
          expenseId: parseId(expenseId) || null,
        },
      });

      return res
        .status(200)
        .json({ message: 'Paiement mis à jour avec succès', updatedPayment });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du paiement :', error);
      return res.status(500).json({
        error: 'Erreur lors de la mise à jour du paiement',
        details: error.message,
      });
    }
  },

  async deletePayment(req, res) {
    try {
      const { id } = req.params;
      const parsedId = parseId(id);

      if (parsedId === null) {
        return res
          .status(400)
          .json({ message: 'ID invalide pour le paiement' });
      }

      const existingPayment = await prisma.payment.findUnique({
        where: { id: parsedId },
      });

      if (!existingPayment) {
        return res.status(404).json({ message: 'Paiement non trouvé' });
      }

      const deletedPayment = await prisma.payment.delete({
        where: { id: parsedId },
      });

      return res
        .status(200)
        .json({ message: 'Paiement supprimé avec succès', deletedPayment });
    } catch (error) {
      console.error('Erreur lors de la suppression du paiement :', error);
      return res.status(500).json({
        error: 'Erreur lors de la suppression du paiement',
        details: error.message,
      });
    }
  },
};

export default PaymentController;
