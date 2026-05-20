# 📚 ReadVerse — Book Store

<div align="center">

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

A full-stack MERN bookstore platform with three dedicated portals — for customers, sellers, and administrators — featuring real-time analytics, book discovery, discounted deals, and complete inventory management.

[Features](#-features) · [Screenshots](#-screenshots) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [User Roles](#-user-roles)

</div>

---

## 📖 Overview

**ReadVerse** is a full-featured online bookstore built on the MERN stack. It brings together three distinct user experiences under one platform:

- **Customers** browse, search, and purchase books with genre filtering, bestseller highlights, and live deals.
- **Sellers / Publishers** manage their own book catalogue, track sales, and monitor revenue from a personal dashboard.
- **Administrators** have platform-wide oversight managing all books, users, sellers, categories, and sales analytics.

---

## ✨ Features

### 🏠 Customer Storefront
- **Hero Landing Page** — "For the Love of Reading" with featured book covers and an Explore CTA
- **Bestsellers Carousel** — horizontally scrollable, with pricing (original + discounted), "Add to Basket", and wishlist buttons
- **Offers / Deals Section** — promotional banners with percentage-off tags
- **Browse Page** — "New Releases This Week" hero + filterable Top Sellers, Bestsellers, and Highest Rated sections
- **Search** — search by book title or author across the entire catalogue
- **Genre Categories** — Fiction, Self Help, Business, Children, and more
- **Cart & Wishlist** — persistent basket and saved books
- **Authentication** — beautiful login page with a full-bleed book-cover mosaic background, Register flow, Remember Me, and Forgot Password

### 🛡️ Admin Panel
- **Overview Dashboard** — at-a-glance stats: Total Books, Total Users, Total Sales, Revenue
- **Purchases Over Time** — combined bar + line chart with time-range filtering (All Time, monthly, etc.)
- **Top Books** — donut chart visualizing the share of top-performing titles
- **Top Performing Books Table** — ranked by downloads with star ratings
- **Book & Category Management** — add, edit, and delete books; create and manage genre categories with pagination
- **User Management** — dual time-series charts for Users Joined and Sellers Joined; searchable Customer List and Seller List with export to CSV
- **Sales Management** — track platform-wide transaction history
- **Settings** — platform configuration

### 🏪 Seller / Publisher Portal
- **Seller Dashboard** — personal stats: Total Books, Total Sales, Today's Sales, Revenue
- **Purchase Over Time Chart** — individual seller's sales trend with time-range filter
- **Top Books Donut Chart** — visual breakdown of the seller's own bestsellers
- **Seller Book Management** — "My Books" table with cover, title, author, category, downloads, and price; Add Book, Edit, Delete, and Export CSV
- **Settings** — seller profile and store configuration

---

## 📸 Screenshots

### 🏠 Homepage
<img width="1920" height="2247" alt="screencapture-localhost-5173-2026-02-22-20_17_25" src="https://github.com/user-attachments/assets/8f7d00e1-a561-4c2a-be63-185508ca59d6" />

### 📖 Browse Page
<img width="1920" height="1771" alt="search" src="https://github.com/user-attachments/assets/ae216783-dd1d-4100-b1e7-d9fa8d145347" />

### 🔐 Login
<img width="1920" height="912" alt="login" src="https://github.com/user-attachments/assets/3b904e08-e731-4f2b-a793-7a15ae6197ca" />


### 🛡️ Admin Dashboard
<img width="1920" height="1511" alt="dashboard" src="https://github.com/user-attachments/assets/bbd40873-eed5-44f6-b2a7-ce8c1590ed9d" />


### 📚 Admin — Book & Category Management
<img width="1920" height="1930" alt="book management" src="https://github.com/user-attachments/assets/deb34f73-03e7-40f9-8fbc-e085a564f253" />


### 👥 Admin — User Management
<img width="1920" height="2323" alt="user management" src="https://github.com/user-attachments/assets/80c3c560-ab5c-4f17-8092-92c5520a1110" />


### 🏪 Seller Dashboard
<img width="1920" height="1127" alt="dashboard" src="https://github.com/user-attachments/assets/ae2e8d27-3f43-4565-9195-55239a55bf26" />


### 📦 Seller — Book Management
<img width="1920" height="1196" alt="book Management" src="https://github.com/user-attachments/assets/4dee07bc-ef84-4ce6-bc8e-2adb2efb628a" />


---

## 🏗️ Project Structure

```
Book-Store/
├── backend/                  # Node.js + Express REST API
│   ├── controllers/          # Route logic (books, users, sellers, orders)
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API route definitions
│   ├── middleware/            # Auth, error handling
│   └── server.js             # Entry point
│
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── pages/            # Route-level pages (Home, Browse, Login, etc.)
│   │   ├── components/       # Reusable UI components
│   │   ├── admin/            # Admin portal pages & components
│   │   ├── seller/           # Seller portal pages & components
│   │   └── App.jsx           # Root component & routing
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 👥 User Roles

| Role | Portal | Key Capabilities |
|------|--------|-----------------|
| **Customer** | Storefront (`/`) | Browse, search, filter, add to cart/wishlist, purchase books |
| **Seller / Publisher** | Seller Panel | List & manage own books, view personal sales & revenue analytics |
| **Admin** | Admin Panel | Full platform control — all books, all users, all sellers, categories, sales |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** `>= 18.x`
- **npm** or **yarn**
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))

---

### 1. Clone the Repository

```bash
git clone https://github.com/AvisarBhandari/Book-Store.git
cd Book-Store
```

---

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/readverse
JWT_SECRET=your_jwt_secret_here
```

Start the backend server:

```bash
npm run dev
```

The API will run at `http://localhost:5000`.

---

### 3. Set Up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The React app will run at `http://localhost:5173`.

---

### 4. Open in Your Browser

```
http://localhost:5173        → Customer Storefront
http://localhost:5173/admin  → Admin Panel
http://localhost:5173/seller → Seller Portal
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router |
| Styling | CSS Modules / Tailwind CSS |
| Charts | Recharts / Chart.js |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Tokens) |
| HTTP Client | Axios |

---

## 🌐 Language Breakdown

```
JavaScript   99.6%   ████████████████████
Other         0.4%   ░░░░░░░░░░░░░░░░░░░░
```

---

## 🔌 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/books` | Get all books |
| `GET` | `/api/books/:id` | Get a single book |
| `POST` | `/api/books` | Add a new book (Seller/Admin) |
| `PUT` | `/api/books/:id` | Update a book (Seller/Admin) |
| `DELETE` | `/api/books/:id` | Delete a book (Admin) |
| `GET` | `/api/users` | Get all users (Admin) |
| `GET` | `/api/sales` | Get sales analytics (Admin/Seller) |

---


## 👨‍💻 Author

**Avisar Bhandari**
- GitHub: [@AvisarBhandari](https://github.com/AvisarBhandari)

---

<div align="center">
  <sub>© 2026 ReadVerse — All Rights Reserved</sub>
</div>
