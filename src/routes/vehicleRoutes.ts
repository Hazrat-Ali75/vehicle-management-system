import Router from 'express';
import * as vehicleController from '../controllers/vehicleControllers';

const router = Router();

router.post('/vehicles', vehicleController.createVehicle);
router.get('/vehicles', vehicleController.getAllVehicles);
router.get('/vehicles/:vehicleId', vehicleController.getVehicleById);
router.put('/vehicles/:vehicleId', vehicleController.updateVehicle);
router.delete('/vehicles/:vehicleId', vehicleController.deleteVehicle)

export default router