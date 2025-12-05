import express from 'express';
import Router from 'express';
import * as authController from '../controllers/authControllers';

const router = Router();

router.post('/signup', authController.registerUser);
router.post('/signin', authController.loginUser)

export default router;