import {  Response } from 'express';
import { AuthRequest } from '../middlewares/middleware';
import * as userService from '../services/userService';

export async function getAllUsers(req: AuthRequest, res: Response) {
     const role = req.user?.role ;
     try {
        const users = await userService.getAllUsers(role!);
        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: users
        })
     } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
     }
}

export async function updateUserRole(req: AuthRequest, res: Response) {
       const { userId } = req.params;
       const { role } = req.body;
       try {
        const updatedUser = await userService.updateUserRole(Number(userId),  role);
        res.status(200).json({
            success: true,
            message: 'User role updated successfully',
            data: updatedUser
        })
       } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message
            })
          }
       }
}

export async function deleteUser(req: AuthRequest, res: Response) {
     const { userId } = req.params;
     const role = req.user?.role ;
        try {
            await userService.deleteUser(Number(userId), role!);
            res.status(200).json({
                success: true,
                message: 'User deleted successfully',
            })
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).json({
                    success: false,
                    message: error.message
                })
            }
        }
}