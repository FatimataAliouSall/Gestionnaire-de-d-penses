import express from "express";
import UserController from "../controllers/UserController.js";

const router = express.Router();
router.post("/users", UserController.createUser);
router.get("/users/:id", UserController.getUser);
router.get("/users", UserController.getAllUsers);
router.put("/users/:id", UserController.updateUser);

router.delete("/users/:id", UserController.deleteUser);

export default router;
