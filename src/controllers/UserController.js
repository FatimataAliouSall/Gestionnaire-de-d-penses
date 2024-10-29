import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const UserController = {
  async createUser(req, res) {
    try {
      const { username, email, password, status } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          status,
        },
      });

      return res
        .status(201)
        .json({ message: 'Utilisateur créé avec succès', newUser });
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur :', error);
      return res
        .status(500)
        .json({ error: 'Erreur lors de la création de l\'utilisateur' });
    }
  },

  async getUser(req, res) {
    try {
      const { id } = req.params;
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur :', error);
      return res
        .status(500)
        .json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
      return res
        .status(500)
        .json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
  },
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, email, password, status } = req.body;

      let hashedPassword = undefined;
      if (password) {
        hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      }
      const updatedUser = await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          username,
          email,
          password: hashedPassword || undefined,
          status,
        },
      });

      return res
        .status(200)
        .json({ message: 'Utilisateur mis à jour avec succès', updatedUser });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
      return res
        .status(500)
        .json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deletedUser = await prisma.user.delete({
        where: { id: parseInt(id) },
      });

      return res
        .status(200)
        .json({ message: 'Utilisateur supprimé avec succès', deletedUser });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', error);
      return res
        .status(500)
        .json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
    }
  },
};

export default UserController;
