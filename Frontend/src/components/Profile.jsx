import React, { useState, useContext } from 'react';
import Navbar from './Navbar';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile, changePassword } = useContext(AuthContext);
  
  // Profile update state
  const [username, setUsername] = useState(user?.username || '');
  const [profileImage, setProfileImage] = useState(user?.profile_image || '');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password update state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');
    if (!username.trim()) return;

    setUpdatingProfile(true);
    const res = await updateProfile(username, profileImage);
    setUpdatingProfile(false);

    if (res.success) {
      setProfileSuccess('Profile updated successfully.');
    } else {
      setProfileError(res.error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    setUpdatingPassword(true);
    const res = await changePassword(currentPassword, newPassword);
    setUpdatingPassword(false);

    if (res.success) {
      setPasswordSuccess('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordError(res.error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto py-10 pb-20 flex flex-col gap-10">
        
        {/* Profile Header info */}
        <div className="flex gap-6 items-center border-b border-neutral-800 pb-8">
          <img 
            className="w-32 h-32 rounded-full object-cover shadow-2xl border-4 border-neutral-800" 
            src={user?.profile_image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username || 'user'}`} 
            alt="Avatar" 
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">PROFILE</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-1">{user?.username}</h1>
            <p className="text-neutral-400 text-sm mt-2">{user?.email}</p>
          </div>
        </div>

        {/* Editing Forms section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Edit Profile */}
          <div className="bg-[#181818] p-6 rounded-lg border border-neutral-900 flex flex-col gap-4">
            <h2 className="text-xl font-bold">Edit Profile Details</h2>
            
            {profileSuccess && <div className="text-green-500 text-sm font-semibold">{profileSuccess}</div>}
            {profileError && <div className="text-red-500 text-sm font-semibold">{profileError}</div>}

            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">USERNAME</label>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#242424] border border-neutral-700 focus:border-white focus:outline-none rounded px-3 py-2 text-white text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">AVATAR IMAGE URL</label>
                <input 
                  type="text" 
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-[#242424] border border-neutral-700 focus:border-white focus:outline-none rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <button 
                type="submit" 
                disabled={updatingProfile}
                className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold py-2 px-4 rounded-full text-sm transition mt-2 w-max self-start"
              >
                {updatingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-[#181818] p-6 rounded-lg border border-neutral-900 flex flex-col gap-4">
            <h2 className="text-xl font-bold">Change Password</h2>

            {passwordSuccess && <div className="text-green-500 text-sm font-semibold">{passwordSuccess}</div>}
            {passwordError && <div className="text-red-500 text-sm font-semibold">{passwordError}</div>}

            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">CURRENT PASSWORD</label>
                <input 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#242424] border border-neutral-700 focus:border-white focus:outline-none rounded px-3 py-2 text-white text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">NEW PASSWORD</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#242424] border border-neutral-700 focus:border-white focus:outline-none rounded px-3 py-2 text-white text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">CONFIRM NEW PASSWORD</label>
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#242424] border border-neutral-700 focus:border-white focus:outline-none rounded px-3 py-2 text-white text-sm"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={updatingPassword}
                className="bg-white text-black hover:bg-neutral-200 font-bold py-2 px-4 rounded-full text-sm transition mt-2 w-max self-start"
              >
                {updatingPassword ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;
