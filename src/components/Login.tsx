import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const navigate = useNavigate();

  const fetchUserId = async (token: string) => {
    if (!token) return null;
    try {
      const res = await api.get('/api/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userId = res.data._id;
      localStorage.setItem('userId', userId);
      return userId;
    } catch (err) {
      console.error('Failed to fetch user:', err);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warn('Please fill in all fields');
      return;
    }
    try {
      const res = await api.post('api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('loginTime', new Date().toISOString());
      await fetchUserId(res.data.token);
      toast.success('Login successful');
      setShowLogin(false);
      navigate('/home');
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error('Login failed');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      toast.warn('Please fill in all fields');
      return;
    }
    try {
      await api.post('/api/auth/register', {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      });
      toast.success('Registration successful. Please log in.');
      setShowSignup(false);
      setShowLogin(true);
    } catch (err) {
      console.error('Registration failed:', err);
      toast.error('Registration failed. Try a different email.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white font-sans relative overflow-hidden">
      <div className={`transition-all duration-500 ease-in-out ${showLogin || showSignup ? 'blur-sm scale-[0.99]' : ''}`}>
        {/* Navbar */}
        <nav className="flex justify-between items-center p-6 shadow-md bg-white/10 backdrop-blur-sm border-b border-white/20">
          <h1 className="text-2xl font-bold tracking-wide text-blue-400">Buddies</h1>
          <div className="space-x-4">
            <button onClick={() => setShowSignup(true)} className="bg-blue-600 hover:bg-blue-700 transition-all py-2 px-4 rounded-full text-white font-semibold">Sign Up</button>
            <button onClick={() => setShowLogin(true)} className="border border-white hover:bg-white hover:text-black transition-all py-2 px-4 rounded-full font-semibold">Login</button>
          </div>
        </nav>

        {/* Hero */}
        <section className="text-center px-6 md:px-20 py-20 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            The Future of <span className="text-blue-400">Social Media</span>
          </h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
            Buddies is your gateway to meaningful connections, secure conversations, and exciting content sharing.
          </p>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto py-16 px-6 grid gap-20">
          {[{
            title: '💬 Real-Time Chat',
            desc: 'Stay in touch instantly with lightning-fast messaging and live updates.',
            img: 'https://www.liveagent.com/wp/urlslab-download/e6864b61a2589bb97296e4b50d226108/Mockup-Real-time-chat.png'
          }, {
            title: '🤝 Stay Connected',
            desc: 'Follow friends, interact with posts, and never miss a moment again.',
            img: 'https://png.pngtree.com/png-vector/20230923/ourmid/pngtree-connected-people-networks-marketing-png-image_10103262.png'
          }, {
            title: '📸 Post Stories',
            desc: 'Share your world with beautiful stories, images, and updates.',
            img: 'https://media.istockphoto.com/id/1427330627/vector/3d-social-media-blogger-social-media-platform-online-social-communication-concept-influencer.jpg?s=612x612&w=0&k=20&c=eYaiu6YyuUfaVmuTZ-NGWbtTmHQ-Bf9S9rrfvYb9CMY='
          }, {
            title: '🔒 Encrypted Platform',
            desc: 'Your data is protected with secure password encryption and best practices.',
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqztuYC_ZukoSapstSS8ZHgBqq6lwj9-qu-Q&s'
          }].map((feature, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-10 items-center">
              <div className={i % 2 !== 0 ? 'md:order-2' : ''}>
                <img src={feature.img} alt={feature.title} className="w-full rounded-2xl shadow-xl" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-blue-400 mb-4">{feature.title}</h3>
                <p className="text-gray-300 text-lg">{feature.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-400 py-8 border-t border-white/10">
          © 2025 Buddies — All rights reserved.
        </footer>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative w-full max-w-4xl bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/20 text-white grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="hidden md:flex items-center justify-center">
              <img
                src="https://unblast.com/wp-content/uploads/2020/05/Group-Chat-Illustration.jpg"
                alt="Login Illustration"
                className="max-w-md w-full animate-fade-in rounded-2xl"
              />
            </div>
            <div className="relative w-full">
              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-4 right-4 z-10 text-gray-300 hover:text-white text-2xl font-bold"
              >✕</button>
              <h1 className="text-3xl font-extrabold text-center mb-4 animate-pulse">
                👋 Welcome Back to <span className="text-blue-400">Buddies</span>
              </h1>
              <p className="text-center text-sm text-gray-300 mb-8">Enter your credentials to reconnect 🌐</p>
              <form onSubmit={handleSubmit} className="space-y-5">
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-5 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-5 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 duration-300">🚀 Login</button>
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-300">Create your account ? <button onClick={() => { setShowLogin(false); setShowSignup(true); }} className="text-blue-400 hover:underline">Sign up</button></p>
                  <Link to="/forgotpassword" className="text-sm text-blue-400 hover:underline">Forgot Password?</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative w-full max-w-4xl bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/20 text-white grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="hidden md:flex items-center justify-center">
              <img
                src="https://unblast.com/wp-content/uploads/2020/05/Group-Chat-Illustration.jpg"
                alt="Signup Illustration"
                className="max-w-md w-full animate-fade-in rounded-2xl"
              />
            </div>
            <div className="relative w-full">
              <button
                onClick={() => setShowSignup(false)}
                className="absolute top-4 right-4 z-10 text-gray-300 hover:text-white text-2xl font-bold"
              >✕</button>
              <h1 className="text-3xl font-extrabold text-center mb-4 animate-pulse">
                ✨ Join <span className="text-blue-400">Buddies</span>
              </h1>
              <p className="text-center text-sm text-gray-300 mb-8">Create your account to start connecting 🚀</p>
              <form onSubmit={handleSignup} className="space-y-5">
                <input type="text" placeholder="Name" value={signupName} onChange={(e) => setSignupName(e.target.value)} required className="w-full px-5 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
                <input type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required className="w-full px-5 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
                <input type="password" placeholder="Password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} required className="w-full px-5 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
                <button type="submit" className="w-full bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 transition-all text-white font-bold py-3 rounded-lg shadow-lg hover:scale-105 duration-300">📝 Sign Up</button>
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-300">Already have an account? <button onClick={() => { setShowSignup(false); setShowLogin(true); }} className="text-blue-400 hover:underline">Login</button></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Login;
