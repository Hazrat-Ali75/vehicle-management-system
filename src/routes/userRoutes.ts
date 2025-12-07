import Router from 'express';
import * as userController from '../controllers/userController';
import { isAuthenticated, requireRole } from '../middlewares/middleware';

const router = Router();

router.get('/users', isAuthenticated, requireRole('admin'), userController.getAllUsers);
router.put('/users/:userId',isAuthenticated, requireRole('admin'), userController.updateUserRole);
router.delete('/users/:userId',isAuthenticated, requireRole('admin'), userController.deleteUser);

export default router;