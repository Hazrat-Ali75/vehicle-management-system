import app from './app'
import dotenv from 'dotenv';
import { initializeDatabase } from './db/schema';

dotenv.config();

initializeDatabase();

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`);
});