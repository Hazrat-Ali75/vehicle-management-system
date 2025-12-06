import Router from "express";
import * as bookingControllers from '../controllers/bookingControllers';

const router = Router();

router.post('/bookings', bookingControllers.createBookings);
router.get('/bookings', bookingControllers.getAllBookings);
router.put('/bookings/:bookingId', bookingControllers.updateBookings);

export default router;