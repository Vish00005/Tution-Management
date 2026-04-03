# Tuition Management App

A comprehensive full-stack application built with the MERN stack to manage tuition center operations, including students, batches, attendance, marks, and fees.

## Prerequisites

- **Node.js**: Ensure Node.js is installed (v18.x or above recommended).
- **MongoDB**: Ensure MongoDB is installed and running on your local machine (`mongodb://127.0.0.1:27017`), or update the `MONGO_URI` environment variable if using MongoDB Atlas.

## Installation & Setup

You will need to open two separate terminal windows—one for the backend and one for the frontend.

### 1. Backend Setup

Navigate into the `backend` folder and install the required dependencies:

```bash
cd backend
npm install
```

### 2. Frontend Setup

Open a new terminal, navigate into the `frontend` folder, and install the required dependencies:

```bash
cd frontend
npm install
```

## Running the Application

### 1. Seed the Database

Before running the application for the first time, you should seed the database to populate it with dummy demo data (such as admins, batches, and students).
Inside the `backend` directory, run:

```bash
cd backend
node seed.js
```

### 2. Start the Backend Server

Once the database is seeded, start your backend Node server. Inside the `backend` directory, run:

```bash
cd backend
node server.js
```

_The backend API will be running at: `http://localhost:8000`_

### 3. Start the Frontend Server

Leave the backend server running. In your second terminal window, inside the `frontend` directory, start the Vite development server:

```bash
cd frontend
npm run dev
```

_The frontend interface will be available at: `http://localhost:5173`_

## Demo Credentials

The database seeder (`seed.js`) automatically provisions the following default accounts for testing the application:

### Administrative Roles

| Role    | Email                   | Password     | Access Level |
| ------- | ----------------------- | ------------ | ------------ |
| Admin   | `admin@institute.edu`   | `admin123`   | Full Access  |
| Manager | `manager@institute.edu` | `manager123` | Management   |

### Student Role

Students are dynamically generated based on standard and batch names. Here is an example of a generated student account:

| Role    | Email                        | Password     | Target Batch                 |
| ------- | ---------------------------- | ------------ | ---------------------------- |
| Student | `student10ba1@institute.edu` | `student123` | Class 10, Batch A, Student 1 |

_(You can replace the standard `10`, batch `a` or `b`, and student number `1-3` to test different student accounts—e.g., `student8ba1@institute.edu`, `student9bb2@institute.edu`, etc.)_

## Environment Variables

Make sure to configure `.env` files if you want to override default configurations.

**`backend/.env`** (Optional):

```env
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/tuition-db
JWT_SECRET=your_jwt_secret
```

## Features

- **RBAC**: Role-based access control (Admin, Manager, Student)
- **Batch Management**: Organize students by standard and classes.
- **Attendance**: Track daily attendance per batch.
- **Marksheets**: Record and share exam performance.
- **Fee Management**: Maintain a history of student fee payments.
