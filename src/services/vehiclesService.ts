import { pool } from "../db/dbConnect";


interface VehicleData{
    vehicle_name: string;
    type: string;
    registration_number: string;
    daily_rent_price: number;
    availability_status: string;
}

export async function createVehicle({vehicle_name, type, registration_number, daily_rent_price, availability_status}: VehicleData){
    const existingVehicle = await pool.query(`SELECT * FROM vehicles WHERE registration_number = $1`, [registration_number]);
    if (existingVehicle.rows.length > 0){
        throw new Error('Vehicle with this registration number already exists');
    }
    const result = await pool.query(
            `INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    )
    return result.rows[0];
}

export async function getAllVehicles(){
    const result = await pool.query(`SELECT * FROM vehicles`);
    return result.rows;
}


export async function getVehicleById(vehicleId: number){
    const result = await pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicleId]);
    return result.rows[0];
}

export async function updateVehicle(id: number, {vehicle_name, type, registration_number, daily_rent_price, availability_status}: VehicleData){
    const result = await pool.query(
        `UPDATE vehicles SET vehicle_name = $1, type = $2, registration_number = $3, daily_rent_price = $4, availability_status = $5 WHERE id = $6 RETURNING *`,
        [vehicle_name, type, registration_number, daily_rent_price, availability_status, id]
    );
    return result.rows[0];
}

export async function deleteVehicle(id: number){
    const isActiveBooking = await pool.query(
        `SELECT * FROM bookings WHERE vehicle_id = $1 AND booking_status = 'active'`,
        [id]
    );
    if (isActiveBooking.rows.length > 0){
        throw new Error('Cannot delete vehicle with active bookings');
    }

    await pool.query(`DELETE FROM vehicles WHERE id = $1`, [id]);
}