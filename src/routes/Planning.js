import express from 'express';
import PlanningController from '../controllers/PlanningController.js';
import {
  createPlanningValidator,
  updatePlanningValidator,
  deletePlanningValidator,
} from '../validators/PlanningValidator.js';
import { authMiddleware } from '../middlewares/auth.js';
// import { authRoleAdmin } from '../middlewares/authRoleAdmin.js';
const router = express.Router();

router.post(
  '/planning',
  authMiddleware,
  // authRoleAdmin,
  createPlanningValidator,
  PlanningController.createPlanning
);

router.get('/planning', authMiddleware, 
  // authRoleAdmin, 
  PlanningController.getAllPlannings);

router.get(
  '/planning/:id',
  authMiddleware,
  // authRoleAdmin,
  deletePlanningValidator,
  PlanningController.getPlanningById
);

router.put(
  '/planning/:id',
  authMiddleware,
  // authRoleAdmin,
  updatePlanningValidator,
  PlanningController.updatePlanning
);

router.delete(
  '/planning/:id',
  authMiddleware,
  // authRoleAdmin,
  deletePlanningValidator,
  PlanningController.deletePlanning
);

export default router;
