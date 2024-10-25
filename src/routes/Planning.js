import express from 'express';
import PlanningController from '../controllers/PlanningController.js';
const router = express.Router();
router.post('/planning', PlanningController.createPlanning);
router.get('/planning', PlanningController.getAllPlannings);
router.get('/planning/:id', PlanningController.getPlanningById);
router.put('/planning/:id', PlanningController.updatePlanning);
router.delete('/planning/:id', PlanningController.deletePlanning);

export default router;
