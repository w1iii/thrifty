/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CircleAlert, X } from 'lucide-react';
import { useAuth } from '../authContext.jsx'
import { Link } from 'react-router-dom'
import API_BASE_URL from '../config.js';
import "./Navbar.css";

function LoginModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [validLogin, setValidLogin] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      )
      login(res.data.user, res.data.token)
      onClose()
      navigate('/dashboard')
    } catch {
      setValidLogin(true)
    } finally {
      setLoading(false);
    }
  };

  function handleClose() {
    onClose()
    setValidLogin(false)
    setPassword('')
    setEmail('')
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" onClick={handleClose}>
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h2>
        <p className="text-slate-500 mb-6">Sign in to continue thrifting</p>

        <div className="space-y-4">
          {validLogin && (
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              <CircleAlert size={16} /> Invalid email or password
            </div>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-brand focus:bg-white"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:border-brand focus:bg-white"
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-brand text-white py-3 rounded-lg font-semibold hover:bg-brand-dark transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <p className="text-center mt-6 text-slate-500 text-sm">
          Don't have an account? <Link to='/signup' onClick={handleClose} className="text-brand font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

function Navbar({ openLoginModal }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    if (openLoginModal) {
      setIsLoginOpen(true);
    }
  }, [openLoginModal]);

  return (
    <>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}

export default Navbar;
