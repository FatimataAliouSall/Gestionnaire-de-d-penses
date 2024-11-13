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
        // userId,
        planningId,
        paymentMethodId,
      } = req.body;
      // const parsedUserId = parseId(userId);
      const parsedPlanningId = parseId(planningId);
      const parsedPaymentMethodId = parseId(paymentMethodId);
      // const userExists = parsedUserId
      //   ? await prisma.user.findUnique({ where: { id: parsedUserId } })
      //   : null;
      const planningExists = parsedPlanningId
        ? await prisma.planning.findUnique({ where: { id: parsedPlanningId } })
        : null;
      const paymentMethodExists = parsedPaymentMethodId
        ? await prisma.paymentMethod.findUnique({
          where: { id: parsedPaymentMethodId },
        })
        : null;
     

      // if (!userExists)
      //   return res
      //     .status(400)
      //     .json({ message: 'L\'utilisateur spécifié n\'existe pas' });
      if (!planningExists)
        return res
          .status(400)
          .json({ message: 'La planification spécifiée n\'existe pas' });
      if (!paymentMethodExists)
        return res
          .status(400)
          .json({ message: 'La méthode de paiement spécifiée n\'existe pas' });
      
      const newPayment = await prisma.payment.create({
        data: {
          amount:amount,
          paymentDate: new Date(paymentDate),
          reference:reference,
          // userId: parsedUserId,
          planningId: parsedPlanningId,
          paymentMethodId: parsedPaymentMethodId,
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
  async getAllPayments(_req, res) {
    try {
      const payments = await prisma.payment.findMany({
        include: {
          user: { select: { username: true } },
          planning: { select: { name: true } },
          paymentMethod: { select: { name: true } },
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

  async getRequirements(_req, res) {
    const plannings = await prisma.planning.findMany();
    const paymentMethods = await prisma.paymentMethod.findMany();
    return res.status(200).json({ plannings, paymentMethods });
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
          user: { select: { username: true } },
          planning: { select: { name: true } },
          paymentMethod: { select: { name: true } },
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
        // userId,
        planningId,
        paymentMethodId,
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
      if (!paymentExists) {
        return res.status(404).json({ message: 'Paiement introuvable' });
      }

      // const userExists = userId
      //   ? await prisma.user.findUnique({ where: { id: parseId(userId) } })
      //   : null;

      let parsedPlanningId = null;
      if (planningId) {
        parsedPlanningId = parseId(planningId);
        if (parsedPlanningId === null) {
          return res
            .status(400)
            .json({ message: 'ID de planification invalide' });
        }
        const planningExists = await prisma.planning.findUnique({
          where: { id: parsedPlanningId },
        });
        if (!planningExists) {
          return res
            .status(400)
            .json({ message: 'La planification spécifiée n\'existe pas' });
        }
      }

      let parsedPaymentMethodId = null;
      if (paymentMethodId) {
        parsedPaymentMethodId = parseId(paymentMethodId);
        if (parsedPaymentMethodId === null) {
          return res
            .status(400)
            .json({ message: 'ID de méthode de paiement invalide' });
        }
        const paymentMethodExists = await prisma.paymentMethod.findUnique({
          where: { id: parsedPaymentMethodId },
        });
        if (!paymentMethodExists) {
          return res
            .status(400)
            .json({ message: 'La méthode de paiement spécifiée n\'existe pas' });
        }
      }

      // Mise à jour du paiement
      const updatedPayment = await prisma.payment.update({
        where: { id: parsedId },
        data: {
          amount,
          paymentDate: new Date(paymentDate),
          reference,
          // userId: parseId(userId) || null,
          planningId: parsedPlanningId || paymentExists.planningId,
          paymentMethodId:
            parsedPaymentMethodId || paymentExists.paymentMethodId,
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

      // Vérifiez si le paiement existe
      const existingPayment = await prisma.payment.findUnique({
        where: { id: parsedId },
      });

      if (!existingPayment) {
        return res.status(404).json({ message: 'Paiement non trouvé' });
      }

      // Essayez de supprimer le paiement
      try {
        const deletedPayment = await prisma.payment.delete({
          where: { id: parsedId },
        });

        return res
          .status(200)
          .json({ message: 'Paiement supprimé avec succès', deletedPayment });
      } catch (error) {
        // Gérer l'erreur de contrainte de clé étrangère
        if (error.code === 'P2003') {
          return res.status(409).json({
            message:
              'Impossible de supprimer le paiement car il est lié à d\'autres enregistrements.',
            suggestion:
              'Veuillez supprimer ou modifier ces enregistrements liés avant de réessayer.',
          });
        }

        // Si c'est une autre erreur, la gérer normalement
        throw error;
      }
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
