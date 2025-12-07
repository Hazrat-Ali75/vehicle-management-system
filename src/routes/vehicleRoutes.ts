import Router from 'express';
import * as vehicleController from '../controllers/vehicleControllers';
import { isAuthenticated, requireRole } from '../middlewares/middleware';

const router = Router();

router.post('/vehicles',isAuthenticated, requireRole('admin'), vehicleController.createVehicle);
router.get('/vehicles', vehicleController.getAllVehicles);
router.get('/vehicles/:vehicleId', vehicleController.getVehicleById);
router.put('/vehicles/:vehicleId',isAuthenticated, requireRole('admin'), vehicleController.updateVehicle);
router.delete('/vehicles/:vehicleId',isAuthenticated, requireRole('admin'), vehicleController.deleteVehicle)

export default router