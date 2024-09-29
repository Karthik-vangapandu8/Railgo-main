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
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center">
      <div className='flex flex-col items-center justify-center lg:border-[1px] rounded-lg lg:h-[90%] lg:w-[30%]'>
        <div className="flex items-center mb-20">
          <div>
            <h1 className="text-white text-6xl font-bold"><span className='text-[#ffcc00]'>Rail</span> G</h1>
          </div>
          <img src="/name2.jpg" alt="Train Logo" className="h-16 w-16" />
        </div>

        <h1 className="text-white lg:text-3xl text-4xl mb-10">LOGIN</h1>

        <form className="flex flex-col items-center justify-center" onSubmit={handleRegister}>
          <div className="w-full flex items-start justify-center mb-4">
            <label className='text-white font-semibold text-xl lg:text-lg'>Phone No: </label>
            <div className='flex pl-4'>
              <span className="bg-white text-black rounded-l-sm py-1 px-1">+91</span>
              <input
                className='rounded-r-sm pl-2 lg:py-0 py-1'
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full flex mb-12">
            <label className='text-white font-semibold text-xl lg:text-lg'>User Name: </label>
            <div className='flex pl-2'>
              <input
                className='rounded-sm pl-2  py-1'
                type="text"
                placeholder="User Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="text-black bg-[#ffcc00] lg:py-1 lg:px-6 py-2 px-10 rounded-full">Register</button>
        </form>

        <footer className="absolute bottom-16 text-white">
          <p>Proudly Made in India <span role="img" aria-label="Indian Flag">🇮🇳</span></p>
        </footer>
      </div>
    </div>
  );
};

export default Register;

