// pages/login.tsx
"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handlePhoneNumberSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('https://chatapp.smpco.tech/api/sendloginOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });
      console.log(response);
      if (response.ok) {
        setIsOtpSent(true);
      } else if (response.status == 422) {
        router.push("/register");
        
      }
      else {
        console.error('Failed to send phone number:', response.statusText);
      }
    } catch (error:any) {
      console.error('Error sending phone number:', error.message);
    } 
  };

  const handleOtpSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
      e.preventDefault();
    try {
      const response = await fetch('https://chatapp.smpco.tech/api/verifyloginOtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({phoneNumber,otp})
      });
      
      if (response.status == 200) {
        
        localStorage.setItem("MyPhone", phoneNumber);
        
       const data = await response.json();
        const token = data.token;
        // Store token in localStorage
        localStorage.setItem('MyToken', token);
        console.log(localStorage.getItem('MyToken'));
        router.push("/")

      } else {
        console.error('Failed to send phone number:', response.statusText);
      }
    } catch (e: any) {
      console.error('Error sending phone number:', e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600">
      <div className="max-w-md w-full px-8 py-12 bg-white shadow-lg rounded-md">
        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">Login</h1>
        {!isOtpSent ? (
          <form onSubmit={handlePhoneNumberSubmit}>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
