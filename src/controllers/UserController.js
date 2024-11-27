import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import {
  sendPasswordResetEmail,
  resetPassword,
} from '../Services/userService.js';

dotenv.config();

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

const UserController = {
  // Création d'un utilisateur
  async createUser(req, res) {
    try {
      const { username, email, password, status, role } = req.body;

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Créer un nouvel utilisateur
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          status,
          role,
        },
      });

      return res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur :', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // Connexion d'un utilisateur
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Trouver l'utilisateur par email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Mot de passe incorrect' });
      }

      // Générer le token JWT
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: '24h',
      });

      return res.status(200).json({
        message: 'Authentification réussie',
        token,
      });
    } catch (error) {
      console.error('Erreur lors de l\'authentification :', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // Obtenir un utilisateur par ID
  async getUser(req, res) {
    try {
      const { id } = req.params;

      // Rechercher l'utilisateur
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur :', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // Obtenir le profil de l'utilisateur connecté
  async getProfile(req, res) {
    try {
      const userId = req.user.userId; // L'identifiant de l'utilisateur connecté

      // Récupérer l'utilisateur via Prisma
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          status: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil :', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  async updateProfile(req, res) {
    try {
      const userId = req.user.userId; // ID de l'utilisateur connecté extrait du middleware d'authentification
      const { username, email, password } = req.body;

      // Vérifier si un email existe déjà pour un autre utilisateur
      if (email) {
        const existingUser = await prisma.user.findUnique({
          where: { email },
        });
        if (existingUser && existingUser.id !== userId) {
          return res
            .status(400)
            .json({
              message: 'Cet email est déjà utilisé par un autre utilisateur',
            });
        }
      }

      // Hacher le mot de passe si fourni
      let hashedPassword = null;
      if (password) {
        hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      }

      // Mise à jour du profil utilisateur
      const updatedProfile = await prisma.user.update({
        where: { id: userId },
        data: {
          username: username || undefined,
          email: email || undefined,
          password: hashedPassword || undefined,
        },
      });

      return res.status(200).json({
        message: 'Profil mis à jour avec succès',
        profile: {
          id: updatedProfile.id,
          username: updatedProfile.username,
          email: updatedProfile.email,
        },
      });
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour du profil utilisateur :',
        error
      );
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // Obtenir tous les utilisateurs
  async getAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          status: true,
        },
      });
      return res.status(200).json(users);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs :', error);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // Mettre à jour un utilisateur
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, email, password, status, role } = req.body;

      let hashedPassword = null;
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
          role,
        },
      });

      return res
        .status(200)
        .json({ message: 'Utilisateur mis à jour avec succès', updatedUser });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
      return res.status(500).json({ message: 'Erreur serveur' });
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
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  },

  // Gestion de réinitialisation de mot de passe
  async requestPasswordReset(req, res) {
    const { email } = req.body;
    try {
      const response = await sendPasswordResetEmail(email);
      res.status(200).json(response);
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation :', error);
      res.status(400).json({ message: error.message });
    }
  },

  async resetPassword(req, res) {
    const { token, newPassword } = req.body;
    try {
      const response = await resetPassword(token, newPassword);
      res.status(200).json(response);
    } catch (error) {
      console.error(
        'Erreur lors de la réinitialisation du mot de passe :',
        error
      );
      res.status(400).json({ message: error.message });
    }
  },
};

export default UserController;
