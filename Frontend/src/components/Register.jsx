import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { assets } from '../assets/assets';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!username || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    const result = await register(username, email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/home');
    } else {
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start pt-12 px-4">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
        <img className="w-12" src={assets.spotify_logo} alt="Spotify Logo" />
        <span className="font-bold text-3xl tracking-tight">Spotify</span>
      </div>

      {/* Card wrapper */}
      <div className="bg-[#121212] p-10 rounded-lg max-w-md w-full border border-neutral-900 shadow-xl mb-12">
        <h2 className="text-3xl font-extrabold mb-6 text-center">Sign up for free</h2>
        
        {errorMsg && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">What should we call you?</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter a profile name"
              className="w-full bg-[#242424] border border-neutral-700 hover:border-neutral-500 focus:border-white focus:outline-none rounded px-4 py-3 text-white transition placeholder-neutral-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">What is your email?</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-[#242424] border border-neutral-700 hover:border-neutral-500 focus:border-white focus:outline-none rounded px-4 py-3 text-white transition placeholder-neutral-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">Create a password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password (min. 6 chars)"
              className="w-full bg-[#242424] border border-neutral-700 hover:border-neutral-500 focus:border-white focus:outline-none rounded px-4 py-3 text-white transition placeholder-neutral-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">Confirm password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full bg-[#242424] border border-neutral-700 hover:border-neutral-500 focus:border-white focus:outline-none rounded px-4 py-3 text-white transition placeholder-neutral-500 text-sm"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-3 px-4 rounded-full mt-2 transition disabled:opacity-50 disabled:cursor-not-allowed hover:scale-102 flex justify-center items-center"
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <hr className="border-neutral-800 my-8" />

        <div className="text-center text-sm text-neutral-400">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:text-green-500 font-semibold underline transition ml-1">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
