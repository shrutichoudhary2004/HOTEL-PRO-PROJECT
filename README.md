# 🏨 HotelPro — Enterprise Hotel Management System (MERN Stack)

**HotelPro** is an end-to-end hotel management solution architected with the **MERN** stack (MongoDB, Express.js, React, Node.js). It streamlines hospitality operations with a secure, scalable backend, high-fidelity room booking engine, role-based guest management, real-time housekeeping lifecycle tracking, and automated tax invoicing.

---

## 🌟 Key Features

### 1. 🔐 Robust Authentication & Role-Based Access Control (RBAC)
- **Roles**:
  - `admin` — Executive Manager: Financial KPIs, revenue reports, room inventory creation/pricing, all reservations.
  - `staff` — Front Desk & Housekeeping: Guest check-in, check-out, room turnover status (`cleaning` ➔ `available`).
  - `guest` — Customer: Browse luxury catalog, reserve rooms, customize VIP add-ons, view bookings, print tax receipts.
- **Security**: JWT (JSON Web Tokens) with expiration, bcrypt password hashing, and route protection guards.

### 2. 🛏️ Intelligent Inventory & Room Management
- Real-time room statuses: `available`, `occupied`, `cleaning`, `maintenance`.
- Rich room schema: Room number, floor, category (`Standard`, `Deluxe`, `Executive Suite`, `Presidential Suite`, `Family Villa`), nightly pricing, capacity, bed types, dimensions, amenities, and photo galleries.
- Automatic Housekeeping Workflow: Guest check-out instantly marks rooms for `cleaning`, alerting staff before room returns to `available`.

### 3. 📅 Date Conflict & Overlap Prevention Engine
- Mathematical validation against overlapping dates: prevents double bookings at database level.
- Dynamic nightly calculation, multi-guest occupancy checks, and availability search.

### 4. 💳 VIP Add-ons, Payment Processing & Automated Invoicing
- Optional stay add-ons: Airport Chauffeur transfer, Gourmet Breakfast Buffet, Thermal Spa pass, Late check-out.
- Dynamic tax & fee computation: 12% Hotel Occupancy Tax, 5% Service Charge.
- Invoicing engine: Generates unique invoice numbers (`INV-YYYY-XXXXXX`), booking codes (`HP-YYYY-XXXX`), and printable tax receipts.

### 5. 📊 Executive Operations & Analytics Dashboard
- Key Performance Indicators (KPIs): Total Revenue, Occupancy Rate %, Active Bookings, Available Rooms, Arrivals Today, Departures Today.
- Room inventory status table with live status transitions.

---

## 📂 Project Directory Structure

```
hotelpro/
├── documents/                    # Official Project Lifecycle Documentation (Phases 1-5)
│   ├── 01_Empathy_Map_Canvas  (1).docx
│   ├── 02_Define_Problem_Statements.docx
│   ├── 03_Brainstorm_and_Idea_Prioritization.docx
│   ├── 04_Project_Planning_and_Sprint_Schedule.docx
│   ├── 05_Solution_Requirements_Functional_and_NonFunctional.docx
│   ├── 06_Technology_Stack_and_Architecture.docx
│   ├── 07_Data_Flow_Diagrams_and_User_Stories.docx
│   ├── 08_Problem_Solution_Fit.docx
│   ├── 09_Proposed_Solution.docx
│   ├── 10_Solution_Architecture.docx
│   ├── 11_User_Acceptance_Testing_UAT.docx
│   └── README.md                 # Documentation catalog & phase breakdown
├── server/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & reconnect logic
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   ├── roomController.js     # Room inventory CRUD & availability engine
│   │   ├── bookingController.js  # Reservation creation, check-in/out, cancellation
│   │   └── analyticsController.js# Hospitality KPIs & revenue metrics
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & Bearer token guard
│   │   ├── role.js               # RBAC permission middleware
│   │   └── errorHandler.js       # Centralized error handler
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt & JWT methods
│   │   ├── Room.js               # Room & inventory schema
│   │   ├── Booking.js            # Booking schema with invoice & pricing fields
│   │   └── Review.js             # Guest reviews & rating schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/v1/auth
│   │   ├── roomRoutes.js         # /api/v1/rooms
│   │   ├── bookingRoutes.js      # /api/v1/bookings
│   │   └── analyticsRoutes.js    # /api/v1/analytics
│   ├── seed/
│   │   ├── seedData.js           # Pre-configured demo accounts & luxury suites
│   │   └── seeder.js             # MongoDB import / reset script
│   ├── .env                      # Environment config
│   ├── .env.example              # Example environment template
│   ├── package.json              # Express, Mongoose, JWT, bcrypt dependencies
│   ├── server.js                 # Standard Express entry point
│   └── standalone-server.js      # Zero-dependency instant-run server
├── client/
│   ├── public/
│   │   └── index.html            # Standalone single-page UI preview
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation with 1-click demo switcher
│   │   │   ├── Footer.jsx        # Luxury footer & security badges
│   │   │   ├── RoomCard.jsx      # Room presentation card
│   │   │   ├── RoomFilter.jsx    # Date, capacity & category filter bar
│   │   │   ├── BookingModal.jsx  # Interactive checkout dialog with add-ons
│   │   │   ├── InvoiceModal.jsx  # Printable official tax receipt
│   │   │   ├── StatsCard.jsx     # Metric cards for dashboards
│   │   │   └── ProtectedRoute.jsx# Client-side RBAC route protection
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state & role helpers
│   │   │   └── BookingContext.jsx# Search dates & booking modals
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Hero landing, amenities, featured suites
│   │   │   ├── RoomsPage.jsx     # Filterable inventory catalog
│   │   │   ├── RoomDetailPage.jsx# Suite gallery, specifications & booking widget
│   │   │   ├── MyBookingsPage.jsx# Guest reservation management & invoices
│   │   │   ├── AdminDashboard.jsx# Executive KPIs & live room manager
│   │   │   ├── StaffDashboard.jsx# Front desk check-ins, check-outs & cleaning
│   │   │   ├── LoginPage.jsx     # Auth login with 1-click demo buttons
│   │   │   └── RegisterPage.jsx  # Guest registration
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptors
│   │   ├── App.jsx               # Application routing layout
│   │   ├── main.jsx              # React DOM entry point
│   │   └── index.css             # Tailwind CSS & theme definitions
│   ├── tailwind.config.js        # Theme colors & typography setup
│   ├── vite.config.js            # Vite configuration with API proxy
│   └── package.json              # React, React Router, Lucide icons, Vite
└── README.md                     # Comprehensive documentation
```

---

## ⚡ Quick Start & Running Options

### Option 1: Instant 1-Command Zero-Dependency Runner (No npm install required!)
If you want to immediately launch both the backend API and frontend interactive app:

```powershell
cd C:\Users\chouh\.gemini\antigravity\scratch\hotelpro
agy-node server/standalone-server.js
# Or with standard node:
node server/standalone-server.js
```

Then open your browser at:
👉 **`http://localhost:5000`**

---

### Option 2: Standard MERN Stack Development Workflow

#### Step 1: Start the Backend (Express & MongoDB)
```powershell
cd C:\Users\chouh\.gemini\antigravity\scratch\hotelpro\server
npm install
npm run seed     # Seeds demo users, rooms, and reservations into MongoDB
npm run dev      # Starts Express on http://localhost:5000
```

#### Step 2: Start the Frontend (React & Vite)
```powershell
cd C:\Users\chouh\.gemini\antigravity\scratch\hotelpro\client
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

---

## 🔑 Pre-Seeded Test Credentials

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@hotelpro.com` | `admin123` | Financial metrics, occupancy KPIs, add/edit room inventory, manage all bookings |
| **Staff** | `staff@hotelpro.com` | `staff123` | Front Desk arrivals/departures, guest check-in/out, housekeeping status sync |
| **Guest** | `guest@hotelpro.com` | `guest123` | Room reservations, custom VIP add-ons, view booking itinerary, tax receipts |

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/v1/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register new guest account |
| `POST` | `/api/v1/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/v1/auth/me` | Private | Get authenticated user profile |
| `PUT` | `/api/v1/auth/profile` | Private | Update user profile info |

### 🛏️ Rooms & Inventory (`/api/v1/rooms`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/rooms` | Public | List rooms with filters (`type`, `status`, `minPrice`, `maxPrice`, `checkIn`, `checkOut`) |
| `GET` | `/api/v1/rooms/:id` | Public | Get single room details and specifications |
| `POST` | `/api/v1/rooms` | Admin | Create a new room in inventory |
| `PUT` | `/api/v1/rooms/:id` | Staff/Admin | Update room details or change status (`available`, `occupied`, `cleaning`, `maintenance`) |
| `DELETE` | `/api/v1/rooms/:id` | Admin | Remove room from inventory |

### 📅 Bookings & Reservations (`/api/v1/bookings`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/bookings` | Private | Create reservation with overlap checks & tax calculation |
| `GET` | `/api/v1/bookings/my` | Private (Guest) | Get current user's reservation history |
| `GET` | `/api/v1/bookings` | Staff/Admin | Get all hotel bookings with filters |
| `GET` | `/api/v1/bookings/:id` | Private | Get reservation and invoice details |
| `PUT` | `/api/v1/bookings/:id/status` | Staff/Admin | Check in guest (`occupied`) or check out guest (`cleaning`) |
| `PUT` | `/api/v1/bookings/:id/cancel` | Private | Cancel reservation & release room back to `available` |

### 📊 Hospitality Analytics (`/api/v1/analytics`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/analytics/dashboard` | Staff/Admin | Get Revenue, Occupancy Rate %, Arrivals & Departures |
