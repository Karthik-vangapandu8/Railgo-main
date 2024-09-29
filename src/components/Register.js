import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const email = `${phoneNumber}@example.com`;
      const password = 'someSecurePassword';
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/Map', { state: { username } });
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center p-4">
      <div className='bg-gray-800 lg:border-[1px] lg:border-gray-700 p-8 rounded-xl shadow-lg w-full max-w-md'>
        {/* Logo and Title */}
        <div className="flex items-center justify-center mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold text-white">
            <span className='text-[#ffcc00]'>Rail</span> G
          </h1>
          <img src="/name2.jpg" alt="Train Logo" className="h-12 w-12 lg:h-16 lg:w-16 ml-4" />
        </div>

        <h1 className="text-white text-3xl lg:text-4xl font-semibold text-center mb-10">
          Sign Up
        </h1>

        {/* Registration Form */}
        <form className="flex flex-col space-y-6" onSubmit={handleRegister}>
          <div className="flex flex-col">
            <label className='text-white font-semibold text-lg lg:text-xl mb-2'>Phone Number</label>
            <div className='flex'>
              <span className="bg-gray-600 text-white rounded-l-lg px-3 py-2">+91</span>
              <input
                className='rounded-r-lg pl-2 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#ffcc00]'
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className='text-white font-semibold text-lg lg:text-xl mb-2'>Username</label>
            <input
              className='rounded-lg pl-2 py-2 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#ffcc00]'
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#ffcc00] text-black font-semibold rounded-full shadow-lg hover:bg-yellow-400 transition-all duration-300"
          >
            Register
          </button>
        </form>

        <footer className="text-center mt-8 text-white">
          <p>Proudly Made in India <span role="img" aria-label="Indian Flag">🇮🇳</span></p>
        </footer>
      </div>
    </div>
  );
};

export default Register;
