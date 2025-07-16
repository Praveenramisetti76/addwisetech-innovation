# UserAuth: Full-Stack QR Code Authentication & Tracking System

## Overview

UserAuth is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for user authentication, QR code generation, sharing, claiming, and device/location tracking. The app supports two main user roles: **admin** and **user**. Admins can generate and manage QR codes, while users can claim and track QR codes. The app features secure authentication, role-based route protection, and a modern, responsive UI.

---

## Figma Design

You can view the application's design prototype on Figma:
[UserAuth Figma Board](https://www.figma.com/board/OinYnZtbs1i56FZoESs8QK/Untitled?node-id=1-203&t=FtWkrfjWblenkcAs-1)

---

## Features

### Authentication & Authorization
- **User Registration & Login**: Secure registration and login for users and admins. Admin registration requires a special code.
- **JWT Authentication**: Secure, stateless authentication using JSON Web Tokens stored in HTTP-only cookies.
- **Role-Based Access Control**: Route protection for admin/user roles.

### QR Code Management
- **QR Code Generation**: Admins can generate one or more QR codes (random 16-digit numbers).
- **QR Code Claiming**: Users can claim unclaimed QR codes by scanning (camera), uploading an image, or manual entry. Claiming requires providing a purpose and location (geolocation).
- **QR Code Tracking**: Users can update and view the location/path of their claimed QR codes. Each tracking event updates the QR code’s path in the database.
- **QR Code Sharing**: Admins can download QR codes as images and share them with users.

### Device & Location Tracking
- **Geolocation**: Users provide their location when claiming or updating a QR code.
- **Path History**: Each QR code maintains a path history of all locations where it was updated.
- **Map Integration**: Claimed QR codes and their paths are visualized on an interactive map (Leaflet).

### User Experience
- **Modern UI**: Built with React, Tailwind CSS, and Vite for a fast, responsive, and visually appealing experience.
- **Notifications**: Real-time feedback using React Toastify.
- **State Persistence**: Redux Toolkit and Redux Persist for robust state management and session persistence.

---

## Technology Stack

### Frontend
- **React.js**: UI library for building the SPA.
- **Redux Toolkit**: State management.
- **Redux Persist**: Persists Redux state in localStorage.
- **React Router DOM**: Routing and navigation.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Vite**: Fast frontend build tool.
- **qrcode.react**: For rendering QR codes.
- **html5-qrcode** and **jsqr**: For scanning QR codes via camera or image upload.
- **react-toastify**: For notifications.
- **leaflet** and **react-leaflet**: For map and geolocation features.
- **@emailjs/browser**: For email integration (if used).

### Backend
- **Node.js**: JavaScript runtime.
- **Express.js**: Web server framework.
- **MongoDB**: NoSQL database.
- **Mongoose**: ODM for MongoDB.
- **jsonwebtoken (JWT)**: For authentication tokens.
- **bcryptjs**: For password hashing.
- **cookie-parser**: For handling cookies.
- **cors**: For cross-origin requests.
- **dotenv**: For environment variable management.
- **nodemon**: For development auto-reloading.

---

## Application Flow

1. **Authentication**
   - Registration: Users can register as either a user or admin. Admin registration requires a special code.
   - Login: Users log in with email and password. On success, a JWT is issued and stored in an HTTP-only cookie.
   - Session Management: Redux and cookies are used to persist login state.
2. **Route Protection**
   - ProtectedRoute: Only allows access to certain routes if the user is authenticated and has the required role.
   - PublicRoute: Redirects logged-in users away from login/signup pages.
3. **Super Admin Features**
   - Super Admin can register using the special code `addwise` during signup.
   - Super Admin can monitor all admins and users from a dedicated dashboard (`/superadmin`).
   - Super Admin has access to view lists of all admins and users, and can be extended to manage them.

---

## Roles & Signup Codes

- **User:** Default role, no code required.
- **Admin:** Requires code  during signup.
- **Super Admin:** Requires code `addwise` during signup. Has the highest privileges and can monitor all users and admins.

---

## API Usage: Updating QR Code Location via Postman

To update or append location details to a QR code, use the following endpoints:

| Purpose                        | URL Example                                                                 |
|---------------------------------|------------------------------------------------------------------------------|
| Assign to user + set location   | http://localhost:3000/api/qr/assign/USER_ID_HERE/7039020220372906           |
| Set location only (no user)     | http://localhost:3000/api/qr/7039020220372906                               |
| Append new location to path     | http://localhost:3000/api/qr/7039020220372906/path                          |

**JSON Body Example:**
```json
{
  "lat": 37.7749,
  "lng": -122.4194
}
```
Replace `lat` and `lng` with the desired coordinates.

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or cloud)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd UserAuth-main
   ```
2. **Install backend dependencies:**
   ```sh
   cd api
   npm install
   ```
3. **Install frontend dependencies:**
   ```sh
   cd ../client
   npm install
   ```
4. **Configure environment variables:**
   - Create a `.env` file in `api/` with:
     ```env
     PORT=3000
     MONGODB=<your-mongodb-uri>
     JWT_SECRET=<your-secret>
     FRONTEND_URL=http://localhost:5173
     ```

### Running the App

- **Start the backend:**
  ```sh
  cd api
  npm start
  ```
- **Start the frontend:**
  ```sh
  cd client
  npm run dev
  ```
- **Access the app:**
  - Frontend: [http://localhost:5173](http://localhost:5173)
  - Backend: [http://localhost:3000](http://localhost:3000)

---

## Folder Structure

```
UserAuth-main/
  api/        # Backend (Express, MongoDB)
  client/     # Frontend (React, Vite, Tailwind)
```

---

## License
MIT