import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { assets } from '../assets/assets';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { forgotPassword } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    const result = await forgotPassword(email);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg('OTP verification code has been sent to your email.');
      setTimeout(() => {
        // Redirect to OTP verification page, passing email as a query parameter
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 2000);
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
      <div className="bg-[#121212] p-10 rounded-lg max-w-md w-full border border-neutral-900 shadow-xl">
        <h2 className="text-3xl font-extrabold mb-4 text-center">Password Reset</h2>
        <p className="text-neutral-400 text-sm text-center mb-6">
          Enter your Spotify email address and we'll send you a 6-digit One-Time Password (OTP) to reset your password.
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
              placeholder="Enter your email address"
              className="w-full bg-[#242424] border border-neutral-700 hover:border-neutral-500 focus:border-white focus:outline-none rounded px-4 py-3 text-white transition placeholder-neutral-500 text-sm"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-3 px-4 rounded-full mt-2 transition disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 flex justify-center items-center"
          >
            {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <hr className="border-neutral-800 my-8" />

        <div className="text-center text-sm text-neutral-400">
          Remember your password?{' '}
          <Link to="/login" className="text-white hover:text-green-500 font-semibold underline transition ml-1">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
