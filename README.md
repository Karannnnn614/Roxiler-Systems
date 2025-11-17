# 🏪 Store Rating Platform

A full-stack web application for managing store ratings with role-based access control. Built with **React.js**, **Express.js**, and **PostgreSQL** (Neon Database).

[![Express.js](https://img.shields.io/badge/Express.js-4.18.2-green)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue)](https://neon.tech/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📋 Features

### 🔐 Three User Roles

#### 1. **System Administrator**

- ✅ Add new stores, users, and admin accounts
- 📊 View dashboard with total users, stores, and ratings statistics
- 👥 Manage all users with filtering and sorting
- 🏪 Manage all stores with filtering and sorting
- 🔍 View detailed user information
- 🔑 Full CRUD operations

#### 2. **Normal User**

- 📝 Sign up and login
- 🔐 Update password
- 🔍 Browse and search stores by name and address
- ⭐ Submit ratings (1-5) for stores
- ✏️ Modify submitted ratings
- 📊 View overall store ratings and personal ratings

#### 3. **Store Owner**

- 🔐 Login and update password
- 📊 View dashboard with average rating
- 👥 See list of users who rated their store
- 📈 Track rating statistics

## 🛠️ Tech Stack

### Backend

- **Framework**: Express.js
- **Database**: PostgreSQL (Neon Database - Cloud Hosted)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **API**: RESTful architecture

### Frontend

- **Framework**: React.js (v18)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Styling**: Custom CSS with responsive design
- **State Management**: React Context API

## 📁 Project Structure

```
Roxiler Systems/
├── client/                  # Frontend React application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── PrivateRoute.js
│   │   │   └── RatingModal.js
│   │   ├── context/         # React Context
│   │   │   └── AuthContext.js
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── user/        # User pages
│   │   │   ├── storeOwner/  # Store owner pages
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   └── UpdatePassword.js
│   │   ├── utils/           # Utilities
│   │   │   ├── api.js       # Axios configuration
│   │   │   └── validation.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── server/                  # Backend Express application
│   ├── config/
│   │   ├── database.js              # PostgreSQL connection
│   │   └── database.postgresql.sql  # Schema & seed data
│   ├── controllers/         # Request handlers
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── storeController.js
│   │   └── storeOwnerController.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # JWT authentication
│   │   └── validation.js    # Input validation
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── storeRoutes.js
│   │   └── storeOwnerRoutes.js
│   ├── .env                 # Environment variables
│   ├── server.js            # Entry point
│   └── package.json
│
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/Karannnnn614/Roxiler-Systems.git
cd Roxiler-Systems
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Environment is already configured with Neon PostgreSQL
# DATABASE_URL is already set in .env file

# Initialize database (creates tables and default admin)
npm run init-db

# Start the backend server
npm run dev
# Server will run on http://localhost:5000
```

### 3. Frontend Setup

```bash
# Open a new terminal
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start the React app
npm start
# App will run on http://localhost:3000
```

## 🔑 Default Credentials

**System Administrator**

- Email: `admin@system.com`
- Password: `Admin@123`

## 📝 Form Validations

- **Name**: 20-60 characters
- **Email**: Standard email format
- **Password**: 8-16 characters, must include:
  - At least one uppercase letter
  - At least one special character (!@#$%^&\*)
- **Address**: Maximum 400 characters
- **Rating**: Integer between 1-5

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `PUT /api/auth/update-password` - Update password

### Admin (Protected)

- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `POST /api/admin/users` - Create user
- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - User details
- `POST /api/admin/stores` - Create store
- `GET /api/admin/stores` - List all stores

### User (Protected)

- `GET /api/stores` - List all stores with search
- `POST /api/stores/rating` - Submit/update rating

### Store Owner (Protected)

- `GET /api/store-owner/dashboard` - View ratings

## ✨ Key Features Implemented

✅ JWT-based authentication with role-based access control  
✅ Password hashing with bcrypt  
✅ Comprehensive input validation (frontend & backend)  
✅ Table sorting (ascending/descending)  
✅ Search and filter functionality  
✅ Responsive design for all screen sizes  
✅ Error handling and user feedback  
✅ Clean, maintainable code structure  
✅ RESTful API design  
✅ Database connection pooling  
✅ CORS enabled for cross-origin requests

## 🎨 UI Features

- Modern gradient design
- Interactive rating system with star UI
- Responsive tables with sorting
- Real-time search and filtering
- Modal dialogs for ratings
- Toast notifications for user actions
- Clean, intuitive navigation

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt (10 rounds)
- Role-based access control
- Input validation and sanitization
- SQL injection prevention with prepared statements
- XSS protection
- CORS configuration

## 📊 Database Schema

### Users Table

- `id`, `name`, `email`, `password`, `address`, `role`, `store_id`, `created_at`, `updated_at`

### Stores Table

- `id`, `name`, `email`, `address`, `owner_id`, `created_at`, `updated_at`

### Ratings Table

- `id`, `user_id`, `store_id`, `rating`, `created_at`, `updated_at`
- Unique constraint: one rating per user per store

### Store Ratings View

- Aggregated view showing average ratings and total count

## 🧪 Testing the Application

1. **Login as Admin**

   - Use default credentials
   - Add new users and stores
   - View statistics and manage data

2. **Register as Normal User**

   - Sign up with valid credentials
   - Browse stores
   - Submit ratings

3. **Login as Store Owner**
   - Create a store via admin
   - Login with store credentials
   - View ratings dashboard

## 🎯 Potential Enhancements

- 📧 Email verification system
- 🔐 Password reset via email
- 📊 Advanced analytics dashboard
- 📸 Store photos and galleries
- 💬 Review comments with ratings
- 📥 Export data to CSV/Excel
- 🌍 Multi-language support
- 🌙 Dark mode theme
- 📱 Mobile app version
- 🔔 Real-time notifications

## 👨‍💻 Development

### Backend Development

```bash
cd server
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development

```bash
cd client
npm start  # Hot reload enabled
```

## 📦 Production Build

### Frontend

```bash
cd client
npm run build
# Creates optimized production build in /build folder
```

### Backend

```bash
cd server
npm start
# Runs server in production mode
```

## 🤝 Contributing

This is a college project/assignment. Feel free to fork and modify for your own learning purposes.

## 📄 License

This project is created for educational purposes.

## 🙏 Acknowledgments

- Built as a full-stack web development project
- Demonstrates modern web development practices
- Clean, maintainable, and scalable architecture

---

## 🌟 Project Highlights

- ✅ **100% Requirements Met**: All features from the coding challenge implemented
- ✅ **Clean Code**: Following best practices and industry standards
- ✅ **Scalable Architecture**: Modular design for easy maintenance
- ✅ **Cloud Database**: PostgreSQL hosted on Neon for reliability
- ✅ **Production Ready**: Fully tested and ready for deployment

## 📧 Contact

Created by [@Karannnnn614](https://github.com/Karannnnn614)

---

**Live Demo**: Coming soon after deployment 🚀
