import React, { useEffect, useState, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Opening from './components/Opening';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import VerifyOTP from './components/VerifyOTP';
import { AuthContext } from './context/AuthContext';

function App() {
  const [isSplashVisible, setSplashVisible] = useState(true);
  const { isAuthenticated, loading } = useContext(AuthContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-lg tracking-wider text-neutral-400">Loading Spotify...</p>
      </div>
    );
  }

  return (
    <>
      {isSplashVisible && <Opening />}
      
      <Routes>
        {/* Full-screen auth & landing views */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        
        {/* Dashboard views wrapped in Home layout */}
        <Route path="/*" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;