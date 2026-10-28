import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import InvoiceModal from './components/InvoiceModal';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import MyBookingsPage from './pages/MyBookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <div className="min-h-screen flex flex-col bg-hotel-cream text-slate-800">
            <Navbar />
            
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/rooms" element={<RoomsPage />} />
                <Route path="/rooms/:id" element={<RoomDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Guest / User Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/my-bookings" element={<MyBookingsPage />} />
                </Route>

                {/* Staff Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['staff', 'admin']} />}>
                  <Route path="/staff" element={<StaffDashboard />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
              </Routes>
            </main>

            <Footer />

            {/* Global Interactive Overlays */}
            <BookingModal />
            <InvoiceModal />
          </div>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
