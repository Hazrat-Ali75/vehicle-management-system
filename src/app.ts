import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes'
import vehicleRoutes from './routes/vehicleRoutes';

const app = express();
app.use(express.json());
app.use(cors());

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', vehicleRoutes)

app.get('/', (req, res)=>{
    res.send('Vehicle Management System Server is running.');
})

export default app;