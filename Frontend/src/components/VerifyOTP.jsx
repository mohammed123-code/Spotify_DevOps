import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { assets } from '../assets/assets';

const VerifyOTP = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { verifyOTP } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract email from query parameter
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !otp || !newPassword || !confirmPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (otp.trim().length !== 6) {
      setErrorMsg('OTP must be a 6-digit code.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const result = await verifyOTP(email, otp, newPassword);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg('Password reset successfully! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start pt-12 px-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-10 cursor-pointer" onClick={() => navigate('/')}>
        <img className="w-12" src={assets.spotify_logo} alt="Spotify Logo" />
        <span className="font-bold text-3xl tracking-tight">Spotify</span>
      </div>

      {/* Main card */}
      <div className="bg-[#121212] p-10 rounded-lg max-w-md w-full border border-neutral-900 shadow-xl mb-12">
        <h2 className="text-3xl font-extrabold mb-4 text-center">Verify OTP</h2>
        <p className="text-neutral-400 text-sm text-center mb-6">
          Enter the 6-digit OTP code sent to <strong>{email || 'your email'}</strong> and choose a new password.
        </p>
        
        {errorMsg && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 text-sm">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded mb-4 text-sm">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">Email address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-[#242424] border border-neutral-700 hover:border-neutral-500 focus:border-white focus:outline-none rounded px-4 py-3 text-white transition placeholder-neutral-500 text-sm opacity-60 cursor-not-allowed"
              readOnly
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">6-Digit OTP Code</label>
            <input 
              type="text" 
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // numbers only
              placeholder="Enter 6-digit code"
              className="w-full text-center tracking-widest text-lg font-bold bg-[#242424] border border-neutral-700 hover:border-neutral-500 focus:border-white focus:outline-none rounded px-4 py-3 text-white transition placeholder-neutral-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">New password</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Create a new password (min. 6 chars)"
              className="w-full bg-[#242424] border border-neutral-700 hover:border-neutral-500 focus:border-white focus:outline-none rounded px-4 py-3 text-white transition placeholder-neutral-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">Confirm new password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full bg-[#242424] border border-neutral-700 hover:border-neutral-500 focus:border-white focus:outline-none rounded px-4 py-3 text-white transition placeholder-neutral-500 text-sm"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-3 px-4 rounded-full mt-2 transition disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 flex justify-center items-center"
          >
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        <hr className="border-neutral-800 my-8" />

        <div className="text-center text-sm text-neutral-400">
          Didn't receive a code?{' '}
          <Link to="/forgot-password" className="text-white hover:text-green-500 font-semibold underline transition ml-1">
            Resend OTP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
