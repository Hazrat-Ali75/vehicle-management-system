import { pool } from '../db/dbConnect';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const JWT_SECRET = process.env.JWT_SECRET;

interface UserData {
    name: string;
    email: string;
    password: string;
    phone : string;
    role: string;
}
export async function registerUser({ name, email, password, phone, role}: UserData){
     const existingUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
     if (existingUser.rows.length > 0) {
        throw new Error('User with this email already exists');
     }
     if(password.length < 6){
        throw new Error('Password must be at least 6 characters long');
     }
     const hashedPassword = await bcrypt.hash(password, 10);
     const result = await pool.query(
        `INSERT INTO users (name, email, password, phone, role) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, email, hashedPassword , phone, role]
     )
    return result.rows[0];
}

export async function loginUser(email: string, password: string){
      const isExistsUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
      if( isExistsUser.rows.length === 0){
         throw new Error('No user found with this email');
      }
      if(!password){
         return null;
      }
      const isPasswordValid = await bcrypt.compare(password, isExistsUser.rows[0].password);
      if(!isPasswordValid){
         throw new Error('Invalid password')
      }
      const token =  jwt.sign(
         { id : isExistsUser.rows[0].id, role: isExistsUser.rows[0].role},
         JWT_SECRET as string,
         { expiresIn: '10min'}
      )
      return { token, user: isExistsUser.rows[0]}
}