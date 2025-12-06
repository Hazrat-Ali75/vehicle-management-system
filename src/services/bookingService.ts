import { pool } from "../db/dbConnect";

interface BookingData {
    customer_id: number;
    vehicle_id: number;
    rent_start_date: string;
    rent_end_date: string;
    total_rent_price: number;
    booking_status: string;
}
export async function createBooking({customer_id, vehicle_id, rent_start_date, rent_end_date, total_rent_price}: BookingData){
    const isAvailable = await pool.query(
        `SELECT * FROM vehicles WHERE id = $1 AND availability_status = 'available'`,
        [vehicle_id]
    );
    if (isAvailable.rows.length === 0){
        throw new Error('Vehicle is not available for booking');
    }
    const daily_rent_price = isAvailable.rows[0].daily_rent_price;
    const rentDays = (new Date(rent_end_date).getTime() - new Date(rent_start_date).getTime())/(1000 * 3600 * 24);
    const calculatedTotalPrice = daily_rent_price * rentDays;
    const booking_status_initial : string = 'active';
    const result = await pool.query(
        `
         WITH inserted AS (
           INSERT INTO bookings (
           customer_id, vehicle_id, rent_start_date,
           rent_end_date, total_rent_price, booking_status
           )
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *
          )
           SELECT 
           inserted.*,
           v.vehicle_name,
           v.daily_rent_price
           FROM inserted
           INNER JOIN vehicles v ON v.id = inserted.vehicle_id;
     `,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, calculatedTotalPrice, booking_status_initial]
    );
    await pool.query(
        `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
        [vehicle_id]
    );
      const row = result.rows[0];

const responseData = {
  id: row.id,
  customer_id: row.customer_id,
  vehicle_id: row.vehicle_id,
  rent_start_date: row.rent_start_date,
  rent_end_date: row.rent_end_date,
  total_price: row.total_rent_price,
  status: row.booking_status,
  vehicle: {
    vehicle_name: row.vehicle_name,
    daily_rent_price: row.daily_rent_price
  }
 };

return responseData;
}

export async function getAllBookings(){
    const userRole = await pool.query(`SELECT role FROM users WHERE id = $1`, [1]); 
    
    const result = await pool.query(`SELECT * FROM bookings`);
    return result.rows;
}

export async function updateBookings(id: number, { customer_id, vehicle_id, rent_start_date, rent_end_date,total_rent_price,booking_status}: BookingData){
    
}