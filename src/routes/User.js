import express from "express";
import UserController from "../controllers/UserController.js";
import {
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
} from "../validators/UserValidator.js";

const router = express.Router();

router.post("/users", createUserValidator, UserController.createUser); // Validation avant la création
router.get("/users/:id", UserController.getUser); // Aucun validateur spécifique pour la lecture par ID
router.get("/users", UserController.getAllUsers); // Aucun validateur spécifique pour la lecture de tous les utilisateurs
router.put("/users/:id", updateUserValidator, UserController.updateUser); // Validation avant la mise à jour
router.delete("/users/:id", deleteUserValidator, UserController.deleteUser); // Validation avant la suppression

export default router;
