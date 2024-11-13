import express from 'express';
import PlanningController from '../controllers/PlanningController.js';
import {
  createPlanningValidator,
  updatePlanningValidator,
  deletePlanningValidator,
} from '../validators/PlanningValidator.js';
// import { authMiddleware } from '../middlewares/auth.js';
const router = express.Router();

router.post(
  '/planning',
  // authMiddleware,
  createPlanningValidator,
  PlanningController.createPlanning
);

router.get('/planning',
  //  authMiddleware, 
   PlanningController.getAllPlannings);

router.get(
  '/planning/:id',
  // authMiddleware,
  deletePlanningValidator,
  PlanningController.getPlanningById
);

router.put(
  '/planning/:id',
  // authMiddleware,
  updatePlanningValidator,
  PlanningController.updatePlanning
);

router.delete(
  '/planning/:id',
  // authMiddleware,
  deletePlanningValidator,
  PlanningController.deletePlanning
);

export default router;
