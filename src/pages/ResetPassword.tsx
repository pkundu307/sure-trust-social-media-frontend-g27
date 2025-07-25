import { useState, useEffect } from 'react';
import {api} from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleReset = async (e:any) => {
    e.preventDefault();
    try {
      await api.post('/user/reset-password', { email, code, newPassword });
      toast.success('Password reset successful');
      localStorage.removeItem('resetEmail');
      navigate('/');
    } catch {
      toast.error('Reset failed');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <ToastContainer position="top-center" />
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <form onSubmit={handleReset} className="space-y-4">
        <input
          type="text"
          placeholder="OTP Code"
          className="border p-2 w-full"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          className="border p-2 w-full"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
