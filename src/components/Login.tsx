import React, { useState } from 'react';
import {api} from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
   

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();// if we don't prevent default, the page will reload
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
        }
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('loginTime', new Date().toISOString());
      navigate('/home');
      //refresh the page to show the new token
        window.location.reload();
    } catch (err) {
        console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white py-2 px-4 w-full rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
