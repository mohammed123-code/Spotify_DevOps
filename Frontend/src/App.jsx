import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Opening from "./components/Opening";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import { useAuth } from "./context/AuthContext";

// Protected route — redirects to /login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useAuth();
  if (authLoading) return (
    <div style={{
      height: "100vh", background: "#121212",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#1DB954", fontSize: "24px",
    }}>
      🎵
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSplashVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isSplashVisible && <Opening />}
      <Routes>
        {/* Public routes */}
        <Route path="/login"           element={<Login />} />
        <Route path="/signup"          element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected main app */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;