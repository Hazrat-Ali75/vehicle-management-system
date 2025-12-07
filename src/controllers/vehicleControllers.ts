import { Request, Response } from "express";
import * as vehicleService from '../services/vehiclesService';
import { AuthRequest } from "../middlewares/middleware";

export async function createVehicle(req: Request, res: Response){
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

    try {
        const newVehicle = await vehicleService.createVehicle({ vehicle_name, type, registration_number, daily_rent_price, availability_status });
        res.status(201).json({
            sucess: true,
            message: 'Vehicle created successfully',
            data: newVehicle
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

export async function getAllVehicles(req: Request, res: Response){
    try {
        const vehicles = await vehicleService.getAllVehicles();
        res.status(200).json({
            success: true,
            message: 'Vehicles retrieved successfully',
            data: vehicles
        })
    } catch (error) {
        if( error instanceof Error){
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

export async function getVehicleById(req: Request, res: Response){
    const vehicleId = req.params.vehicleId;
    try {
        const vehicle = await vehicleService.getVehicleById(Number(vehicleId));
        res.status(200).json({
            success: true,
            message: 'Vehicle retrieved successfully',
            data: vehicle
        })
    } catch (error) {
        if(error instanceof Error){
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}

export async function updateVehicle(req: AuthRequest, res: Response){
    const id = req.params.vehicleId;
    const role = req.user?.role;
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

    try {
        const updatedVehicle = await vehicleService.updateVehicle(Number(id), role, { vehicle_name, type, registration_number, daily_rent_price, availability_status });
        res.status(200).json({
            success: true,
            message: 'Vehicle updated successfully',
            data: updatedVehicle
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

export async function deleteVehicle(req: AuthRequest, res: Response){
    const id = req.params.id;
    const role = req.user?.role;
    try {
        await vehicleService.deleteVehicle(Number(id), role);
        res.status(200).json({
            success: true,
            message: 'Vehicle deleted successfully'
        })
    }catch (error){
        if (error instanceof Error){
            res.status(400).json({
                success: false,
                message: error.message
            })
        }
    }
}