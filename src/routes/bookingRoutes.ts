import Router from "express";
import * as bookingControllers from '../controllers/bookingControllers';
import { isAuthenticated } from "../middlewares/middleware";

const router = Router();

router.post('/bookings',isAuthenticated, bookingControllers.createBookings);
router.get('/bookings', isAuthenticated, bookingControllers.getAllBookings);
router.put('/bookings/:bookingId',isAuthenticated, bookingControllers.updateBookings);

export default router;