import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

function parseUserId(userId) {
  const parsed = parseInt(userId, 10);
  return isNaN(parsed) ? null : parsed;
}

const PaymentMethodController = {
  async createPaymentMethod(req, res) {
    try {
      const { name, status, userId } = req.body;
      const parsedUserId = parseUserId(userId);

      if (parsedUserId) {
        const userExists = await prisma.user.findUnique({
          where: { id: parsedUserId },
        });
        if (!userExists) {
          return res
            .status(400)
            .json({ message: 'L\'utilisateur spécifié n\'existe pas' });
        }
      }
      const existingPaymentMethod = await prisma.paymentMethod.findFirst({
        where: { name, userId: parsedUserId },
      });
      if (existingPaymentMethod) {
        return res
          .status(400)
          .json({ message: 'Un mode de paiement avec ce nom existe déjà' });
      }

      const newPaymentMethod = await prisma.paymentMethod.create({
        data: {
          name,
          status,
          userId: parsedUserId,
        },
      });

      return res.status(201).json({
        message: 'Mode de paiement créé avec succès',
        newPaymentMethod,
      });
    } catch (error) {
      console.error('Erreur lors de la création du mode de paiement :', error);
      return res.status(500).json({
        error: 'Erreur lors de la création du mode de paiement',
        details: error.message,
      });
    }
  },

  async getAllPaymentMethods(req, res) {
    try {
      const paymentMethods = await prisma.paymentMethod.findMany({
        include: {
          user: true,
          payments: true,
        },
      });
      return res.status(200).json(paymentMethods);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des modes de paiement :',
        error
      );
      return res.status(500).json({
        message: 'Erreur lors de la récupération des modes de paiement',
        error,
      });
    }
  },

  async getPaymentMethodById(req, res) {
    try {
      const { id } = req.params;
      const parsedId = parseUserId(id);

      if (parsedId === null) {
        return res
          .status(400)
          .json({ message: 'ID invalide pour le mode de paiement' });
      }

      const paymentMethod = await prisma.paymentMethod.findUnique({
        where: { id: parsedId },
      });
      if (!paymentMethod) {
        return res.status(404).json({ message: 'Mode de paiement non trouvé' });
      }
      return res.status(200).json(paymentMethod);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération du mode de paiement :',
        error
      );
      return res.status(500).json({
        error: 'Erreur lors de la récupération du mode de paiement',
        details: error.message,
      });
    }
  },

  async updatePaymentMethod(req, res) {
    try {
      const { id } = req.params;
      const { name, status } = req.body;
      const parsedId = parseUserId(id);

      if (parsedId === null) {
        return res
          .status(400)
          .json({ message: 'ID invalide pour le mode de paiement' });
      }

      const paymentMethodExists = await prisma.paymentMethod.findUnique({
        where: { id: parsedId },
      });
      if (!paymentMethodExists) {
        return res
          .status(404)
          .json({ message: 'Mode de paiement introuvable' });
      }

      const updatedPaymentMethod = await prisma.paymentMethod.update({
        where: { id: parsedId },
        data: {
          name,
          status,
        },
      });

      return res.status(200).json({
        message: 'Mode de paiement mis à jour avec succès',
        updatedPaymentMethod,
      });
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour du mode de paiement :',
        error
      );
      return res.status(500).json({
        error: 'Erreur lors de la mise à jour du mode de paiement',
        details: error.message,
      });
    }
  },

  async deletePaymentMethod(req, res) {
    try {
      const { id } = req.params;
      const parsedId = parseUserId(id);

      if (parsedId === null) {
        return res
          .status(400)
          .json({ message: 'ID invalide pour le mode de paiement' });
      }

      const existingPaymentMethod = await prisma.paymentMethod.findUnique({
        where: { id: parsedId },
      });

      if (!existingPaymentMethod) {
        return res.status(404).json({ message: 'Mode de paiement non trouvé' });
      }

      const deletedPaymentMethod = await prisma.paymentMethod.delete({
        where: { id: parsedId },
      });

      return res.status(200).json({
        message: 'Mode de paiement supprimé avec succès',
        deletedPaymentMethod,
      });
    } catch (error) {
      console.error(
        'Erreur lors de la suppression du mode de paiement :',
        error
      );
      return res.status(500).json({
        error: 'Erreur lors de la suppression du mode de paiement',
        details: error.message,
      });
    }
  },
};

export default PaymentMethodController;
