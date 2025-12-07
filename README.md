# Vehicle Rental System

A backend system built with **Node.js**, **TypeScript**, **Express.js**, and **PostgreSQL** to manage vehicles, customers, and rental bookings. The system includes **secure authentication**, **role-based access**, and a modular architecture for scalability.

---

## 🚀 Live URL
(https://vehicle-management-system-alpha.vercel.app/)

#Project Structer 

📂 src
├── 📂 controllers
│ ├── 📄 authControllers.ts
│ ├── 📄 bookingControllers.ts
│ ├── 📄 userController.ts
│ └── 📄 vehicleControllers.ts
├── 📂 db
│ ├── 📄 dbConnect.ts
│ └── 📄 schema.ts
├── 📂 middlewares
│ └── 📄 middleware.ts
├── 📂 routes
│ ├── 📄 authRoutes.ts
│ ├── 📄 bookingRoutes.ts
│ ├── 📄 userRoutes.ts
│ └── 📄 vehicleRoutes.ts
├── 📂 services
├── 📄 app.ts
└── 📄 server.ts
📄 .env
📄 package.json
📄 tsconfig.json


### Folder Description

- **📂 controllers/**: Handles request logic for authentication, users, bookings, and vehicles.  
- **📂 db/**: Database connection setup and schema definitions.  
- **📂 middlewares/**: Custom middleware functions.  
- **📂 routes/**: API endpoints for authentication, bookings, users, and vehicles.  
- **📂 services/**: Business logic or utility functions.  
- **📄 app.ts**: Main application setup.  
- **📄 server.ts**: Server entry point.  
- **📄 .env**: Environment variables.  
- **📄 package.json**: Project dependencies and scripts.  
- **📄 tsconfig.json**: TypeScript configuration.  


## ⭐ Features

### 🔐 **Authentication**
- Register new user accounts (Public)
- Login using email and password (Public)
- Receive JWT token on successful login
- Passwords securely hashed using **bcrypt**

---

### 🚗 **Vehicle Management**
**(Admin-only for all write operations)**  
- Add vehicles with:
  - name  
  - type  
  - registration number  
  - daily rental price  
  - availability status  
- View all vehicles (Public)
- View individual vehicle details (Public)
- Update vehicle info including:
  - details  
  - pricing  
  - availability status  
- Delete vehicles  
  - **Only if no active bookings exist**
- Availability auto-updates when:
  - A vehicle is booked → marked **“booked”**
  - A booking is returned → marked **“available”**

---

### 👤 **User Management**
- Admin can view all users  
- Admin can update any user’s:
  - role  
  - profile  
  - account details  
- Customers can update **only their own profile**  
- Admin can delete users  
  - **Only if the user has no active bookings**

---

### 📅 **Booking Management**
- Create bookings (Customer or Admin)
  - Validates vehicle availability  
  - Calculates rental price (daily rate × duration)  
  - Marks the vehicle as **“booked”**  
- Role-based booking visibility:
  - Admin → View **all bookings**  
  - Customer → View **own bookings only**  
- Cancel bookings:
  - Customer may cancel **only before start date**
- Mark as returned:
  - Admin marks booking **“returned”**
  - Vehicle becomes **“available”** again
- Automatic return:
  - System auto-marks bookings as **“returned”** when end date passes

## 🧰 Technology Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js + TypeScript |
| Backend Framework | Express.js |
| Database | PostgreSQL |
| Auth | JSON Web Tokens (jsonwebtoken) |
| Security | bcrypt |

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Hazrat-Ali75/vehicle-management-system.git
cd vehicle-management-system

2️⃣ Install Dependencies
npm install

3️⃣ Environment Variables

Create a .env file:

PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/your_db
JWT_SECRET=your_jwt_secret

4️⃣ Database Setup

(If using migrations, include the commands here)

Example placeholder:

npm run db:init

5️⃣ Start Development Server
npm run dev


Server URL:

http://localhost:5000

📘 API Endpoints
🔐 Auth Routes
Method	Endpoint	Access	Description
POST	/api/v1/auth/signup	Public	Register new user account
POST	/api/v1/auth/signin	Public	Login and receive JWT token


🚗 Vehicle Routes
Method	Endpoint	Access	Description
POST	/api/v1/vehicles	Admin only	Add new vehicle
GET	/api/v1/vehicles	Public	View all vehicles
GET	/api/v1/vehicles/:vehicleId	Public	View vehicle details
PUT	/api/v1/vehicles/:vehicleId	Admin only	Update vehicle info
DELETE	/api/v1/vehicles/:vehicleId	Admin only	Delete vehicle (no active bookings allowed)


👤 User Routes
Method	Endpoint	Access	Description
GET	/api/v1/users	Admin only	View all users
PUT	/api/v1/users/:userId	Admin or Owner	Update user details
DELETE	/api/v1/users/:userId	Admin only	Delete user (no active bookings allowed)


📅 Booking Routes
Method	Endpoint	Access	Description
POST	/api/v1/bookings	Customer/Admin	Create booking, validate availability, calculate price
GET	/api/v1/bookings	Role-based	Admin: all bookings, Customer: own bookings
PUT	/api/v1/bookings/:bookingId	Role-based	Cancel (customer before start) or return (admin)

