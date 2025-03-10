import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import FeaturedHealthCheckup from "./components/FeaturedHealthCheckup";
import WhyChooseUs from "./components/WhyChooseUs";
import Footer from "./components/Footer";
import ConcernHealthCheckups from "./components/ConcernHealthCheckups";
import FunctionSection from "./components/FunctionSection";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminDashboard from "./components/AdminDashboard";
import { GoogleOAuthProvider } from '@react-oauth/google';

// Check if user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem("user") !== null;
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      {/* <Navbar /> */}
      <Routes>
        {/* ✅ Public Landing Page */}
        <Route
          path="/"
          element={
            <>
              <Landing />
              <FunctionSection />
              <FeaturedHealthCheckup />
              <ConcernHealthCheckups />
              <WhyChooseUs />
              <Footer />
            </>
          }
        />

        {/* ✅ Protected Routes (Only Accessible After Login) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Authentication Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;
