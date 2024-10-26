import express from 'express';
import PlanningController from '../controllers/PlanningController.js';
import {
  createPlanningValidator,
  updatePlanningValidator,
  deletePlanningValidator,
} from '../validators/PlanningValidator.js'; 

const router = express.Router();

router.post(
  '/planning',
  createPlanningValidator, 
  PlanningController.createPlanning
);

router.get('/planning', PlanningController.getAllPlannings);

router.get(
  '/planning/:id',
  deletePlanningValidator, 
  PlanningController.getPlanningById
);

router.put(
  '/planning/:id',
  updatePlanningValidator, 
  PlanningController.updatePlanning
);

router.delete(
  '/planning/:id',
  deletePlanningValidator, 
  PlanningController.deletePlanning
);

export default router;
