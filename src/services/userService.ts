import { pool } from "../db/dbConnect";



export async function getAllUsers(role:string){
     if(role === 'admin'){
        const users = await pool.query('SELECT * FROM users');
        const sanitizedUsers = users.rows.map(({ password, ...rest }) => rest);
        return sanitizedUsers;
     }
}

export async function updateUserRole(userId: number,  roleToUpdate: string){
    const requester = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);
    const requesterRole = requester.rows[0].role;
    if(requesterRole !== 'admin'){
        throw new Error('Only admin can update user roles.');
    }
    else if(requesterRole === 'admin'){
        const updatedUser = await pool.query('UPDATE users SET role = $1 WHERE id = $2 RETURNING *', [roleToUpdate, userId]);
        const { password, ...sanitizedUser } = updatedUser.rows[0];
        return sanitizedUser;
    }
}

export async function deleteUser(userId:number, role:string ){
    const isActiveBooking = await pool.query('SELECT * FROM bookings WHERE customer_id = $1', [userId]);
    if(isActiveBooking.rows.length > 0){
        throw new Error('Cannot delete user with active bookings.');
    }
    if(role === 'admin'){
        await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    }
}