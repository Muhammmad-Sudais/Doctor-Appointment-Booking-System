# Doctor Appointment Booking System

A full-stack web application for booking doctor appointments. It includes three main components: a patient frontend, a doctor/admin dashboard, and a backend server.

## Features

- **Patient Interface:** Browse doctors, book appointments, view appointment history, and profile management.
- **Doctor/Admin Module:** Manage appointments, add new doctors, and view dashboard statistics.
- **Authentication:** Secure login for patients, doctors, and admins.
- **Payments:** Integrated with Razorpay for appointment fees.
- **Image Upload:** Cloudinary integration for doctor profile images.

## Project Structure

- `frontend/`: React + Vite application for patients.
- `admin/`: React + Vite application for administrators and doctors.
- `backend/`: Node.js + Express server with MongoDB.

## Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (Local or Atlas)
- **Cloudinary Account** (for image storage)
- **Razorpay Account** (for payments)

## Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Muhammmad-Sudais/Doctor-Appointment-Booking-System.git
    cd Doctor-Appointment-Booking-System
    ```

2.  **Install Dependencies:**
    You need to install dependencies for all three folders: `backend`, `frontend`, and `admin`.
    ```bash
    cd backend && npm install
    cd ../frontend && npm install
    cd ../admin && npm install
    cd ..
    ```

3.  **Environment Variables:**
    Create `.env` files in each directory using the provided `.env.example` templates.

    - **Backend (`backend/.env`):**
      ```env
      PORT=4000
      MONGODB_URI=your_mongodb_connection_string
      JWT_SECRET=your_secret_key
      ADMIN_EMAIL=admin@example.com
      ADMIN_PASSWORD=your_admin_password
      CLOUDINARY_CLOUD_NAME=...
      CLOUDINARY_API_KEY=...
      CLOUDINARY_API_SECRET=...
      RAZORPAY_KEY_ID=...
      RAZORPAY_KEY_SECRET=...
      CURRENCY=INR
      ```

    - **Frontend (`frontend/.env`):**
      ```env
      VITE_BACKEND_URL=http://localhost:4000
      VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
      ```

    - **Admin (`admin/.env`):**
      ```env
      VITE_BACKEND_URL=http://localhost:4000
      ```

4.  **Run the Application:**
    Open three separate terminal instances (or use a concurrent runner if configured).

    - **Backend:**
      ```bash
      cd backend
      npm invoke nodemon server.js
      # or
      node server.js
      ```

    - **Frontend:**
      ```bash
      cd frontend
      npm run dev
      ```

    - **Admin:**
      ```bash
      cd admin
      npm run dev
      ```

5.  **Access the Apps:**
    - Frontend (Patient): `http://localhost:5173` (default Vite port)
    - Admin/Doctor: `http://localhost:5174` (check terminal for exact port)

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **External Services:** Cloudinary (Images), Razorpay (Payments)

## License

[MIT](LICENSE)
