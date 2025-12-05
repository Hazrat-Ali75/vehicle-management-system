import { Request, Response } from 'express' 
import * as authService from '../services/authService'

export async function registerUser(req: Request, res: Response){
     const { name, email, password, phone, role } = req.body;

     try {
        const newUser = await authService.registerUser({name, email, password, phone, role});
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data : {
                id : newUser.id,
                name : newUser.name,
                email : newUser.email,
                phone : newUser.phone,
                role : newUser.role
            }
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

export async function loginUser(req: Request, res: Response){
    const { email, password} = req.body;

    try {
        const result = await authService.loginUser(email, password);
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data : {
                token : result?.token,
                user : {
                    id : result?.user.id,
                    name : result?.user.name,
                    email : result?.user.email,
                    phone : result?.user.phone,
                    role : result?.user.role
                }
            }
        })
    } catch (error) {
        if( error instanceof Error){
            res.status(400).json({
                success: false,
                message : error.message
            })
        }
    }
}