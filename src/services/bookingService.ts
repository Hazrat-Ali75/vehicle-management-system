import { pool } from "../db/dbConnect";

interface BookingData {
    customer_id: number;
    vehicle_id: number;
    rent_start_date: string;
    rent_end_date: string;
}

export async function createBooking({customer_id, vehicle_id, rent_start_date, rent_end_date}: BookingData){
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

export async function getAllBookings(role: string | undefined, userId: number | undefined){
    let result;
    if (role === 'admin'){
        const adminQuery =`
            SELECT jsonb_build_object(
                'id', b.id,
                'customer_id', b.customer_id,
                'vehicle_id', b.vehicle_id,
                'rent_start_date', b.rent_start_date,
                'rent_end_date', b.rent_end_date,
                'total_price', b.total_rent_price,
                'status', b.booking_status,
                'customer', jsonb_build_object(
                    'name', u.name,
                    'email', u.email
                ),
                'vehicle', jsonb_build_object(
                    'vehicle_name', v.vehicle_name,
                    'registration_number', v.registration_number
                )
            ) AS data
            FROM bookings b
            JOIN users u ON b.customer_id = u.id
            JOIN vehicles v ON b.vehicle_id = v.id;
        `;
          result = await pool.query(adminQuery);
    }else if(role === 'customer' && userId){
        const customerQuery = `
            SELECT jsonb_build_object(
                'id', b.id,
                'vehicle_id', b.vehicle_id,
                'rent_start_date', b.rent_start_date,
                'rent_end_date', b.rent_end_date,
                'total_price', b.total_rent_price,
                'status', b.booking_status,
                'vehicle', jsonb_build_object(
                    'vehicle_name', v.vehicle_name,
                    'registration_number', v.registration_number,
                    'type', v.type
                )
            ) AS data
            FROM bookings b
            JOIN vehicles v ON b.vehicle_id = v.id
            WHERE b.customer_id = $1;
        `;
           result = await pool.query(customerQuery, [userId]);
    }
    return result?.rows.map(row => row.data);
}

export async function updateBookings(
    bookingId: number,
    role: string | undefined,
    status: string
) {
    const today = new Date().toISOString().split("T")[0];


    const bookingData = await pool.query(
        `SELECT * FROM bookings WHERE id = $1`,
        [bookingId]
    );

    if (bookingData.rows.length === 0) {
        throw new Error("Booking not found");
    }

    const booking = bookingData.rows[0];

    if (role === "customer") {
        if (booking.rent_start_date <= today!!) {
            throw new Error("You cannot cancel the booking after it has started");
        }

        const result = await pool.query(
            `UPDATE bookings SET booking_status = $1 WHERE id = $2 RETURNING *`,
            [status, bookingId]
        );

        await pool.query(
            `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
            [booking.vehicle_id]
        );

        return result.rows[0];
    }

    if (role === "admin") {
        const result = await pool.query(
            `UPDATE bookings SET booking_status = $1 WHERE id = $2 RETURNING *`,
            [status, bookingId]
        );

        await pool.query(
            `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
            [booking.vehicle_id]
        );

        return result.rows[0];
    }

    if (booking.rent_end_date < today!!) {
        const autoUpdate = await pool.query(
            `UPDATE bookings SET booking_status = 'returned' WHERE id = $1 RETURNING *`,
            [bookingId]
        );

        await pool.query(
            `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
            [booking.vehicle_id]
        );

        return autoUpdate.rows[0];
    }
}
