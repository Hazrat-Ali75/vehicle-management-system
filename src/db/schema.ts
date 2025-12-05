import { pool } from "./dbConnect";


export async function initializeDatabase(){
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) CHECK (LENGTH(password) >= 6) NOT NULL,
            phone INTEGER NOT NULL,
            role VARCHAR(20) CHECK (role IN ('admin', 'customer')) NOT NULL
        )`);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles (
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(100) NOT NULL,
            type VARCHAR(50) CHECK (type IN ('car', 'bike', 'van', 'SUV')),
            registration_number VARCHAR(50) UNIQUE NOT NULL,
            daily_rent_price NUMERIC(10, 2) NOT NULL CHECK (daily_rent_price > 0),
            availability_status VARCHAR(20) CHECK (availability_status IN ('available', 'booked'))
        )`);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            vehicle_id INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
            rent_start_date DATE NOT NULL,
            rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
            total_rent_price NUMERIC(10, 2) NOT NULL CHECK (total_rent_price > 0),
            booking_status VARCHAR(20) CHECK (booking_status IN ('active', 'cancelled', 'returned'))
        )`);
}