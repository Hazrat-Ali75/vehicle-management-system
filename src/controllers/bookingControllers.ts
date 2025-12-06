import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/middleware";
import * as bookingService from '../services/bookingService';

export async function createBookings(req: Request, res: Response){
     const {customer_id, vehicle_id, rent_end_date, rent_start_date} = req.body;
     try {
          const newBooking = await bookingService.createBooking({customer_id, vehicle_id, rent_end_date, rent_start_date});
          res.status(201).json({
               success: true,
               message: 'Booking created successfully',
               data: newBooking
          })
     } catch (error) {
          if (error instanceof Error){
               res.status(400).json({
                    success: false,
                    message: error.message
               })
          }
 }
}

export async function getAllBookings(req: AuthRequest, res: Response){
     const role = req.user?.role;
     const userId = req.user?.id;
     try {
          const result = await bookingService.getAllBookings(role, userId);
          res.status(200).json({
               success: true,
               message: role === 'admin'? 'Bookings retrieved successfully':'Your bookings retrieved successfully',
               data: result
          })
     } catch (error) {
          if (error instanceof Error){
               res.status(500).json({
                    success: false,
                    message: error.message
               })
          }
     }
}

export async function updateBookings(req: AuthRequest, res: Response){
    const bookingId = req.params.bookingId;
    const role = req.user?.role;
    const status = req.body.status;
    try {
     const updatedBooking = await bookingService.updateBookings(Number(bookingId), role, status);
     res.status(200).json({
          success: true,
          message: updatedBooking.booking_status === 'cancelled' ? 'Booking cancelled successfully' : 'Booking marked as returned. Vehicle is now available',
          data: updatedBooking
     })
    } catch (error) {
     if (error instanceof Error){
          res.status(400).json({
               success: false,
               message: error.message
          })
     }
  }
}