# MediSync - Medical Record Management System

## Overview
A comprehensive healthcare management system built with React.js and Node.js that enables secure communication between patients, doctors, and administrators.

## Features

### Patient Features
- 🔐 Secure registration and login
- 📁 Upload and manage medical records
- 💊 Medication scheduling with smart reminders
- 👨‍⚕️ Consult doctors and manage access permissions
- 📊 View doctor-prescribed medications and notes

### Doctor Features
- 🏥 Professional registration with admin approval
- 👥 View consultation requests from patients
- 📋 Access patient records (with permission)
- 💉 Prescribe medications to patients
- 📝 Add medical notes and records

### Admin Features
- ⚡ Approve/reject doctor registrations
- 👀 Monitor all system activities
- 🔍 Manage user accounts and access

## Tech Stack
- **Frontend**: React.js, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time**: Socket.IO
- **Authentication**: JWT

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd medisync
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Set up environment variables
```bash
# Create .env file in backend folder
MONGODB_URI=mongodb://localhost:27017/medisync
JWT_SECRET_KEY=your_secret_key
```

5. Start the application
```bash
# Backend (port 5000)
cd backend
npm start

# Frontend (port 3000)
cd frontend
npm start
```

## Usage

1. **Admin Setup**: First user with admin role can approve doctors
2. **Doctor Registration**: Doctors register and wait for admin approval
3. **Patient Registration**: Patients can register immediately
4. **Consultation Flow**: Patient → Request → Doctor Approval → Prescription
5. **Medication Reminders**: Real-time notifications for medication schedules

## Project Structure
```
medisync/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
└── frontend/
    ├── src/
    │   ├── components/
    │   └── theme/
    └── public/
```

## Key Learning Outcomes
- Full-stack web development
- RESTful API design
- Database modeling
- Real-time communication
- Authentication & authorization
- File upload handling
- Responsive UI design