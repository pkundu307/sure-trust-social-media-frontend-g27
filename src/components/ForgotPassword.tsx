import { useState } from 'react';
import {api} from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const handleSubmit = async (e:any) => {
  e.preventDefault();
  try {
    await api.post('/user/forgot-password', { email });
    localStorage.setItem('resetEmail', email); // ✅ store email
    toast.success('OTP sent. Redirecting to reset page...', {
        position: 'top-center',
        autoClose: 3000,
      });
    navigate('/resetpassword');
  } catch {
    toast.error('Failed to send OTP. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
      });
  }
};


  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded">
          Send OTP
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
