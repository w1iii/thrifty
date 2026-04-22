import { useState, useEffect } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CircleAlert, X } from 'lucide-react';
import { useAuth } from '../authContext.jsx'
import { Link } from 'react-router-dom'
import "./Navbar.css";

function LoginModal({ isOpen, onClose, onSwitchToSignup }) {
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

    try{
      const res = await axios.post('http://localhost:5050/api/auth/login', 
        { email, password },
        { withCredentials: true }
      )
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    }catch(err){
      setValidLogin(true)
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  function handleClose(){
    onClose()
    setValidLogin(false)
    setPassword('')
    setEmail('')
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content-form" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose}>
          <X size={20} />
        </button>
        
        <h2>Welcome back</h2>
        <p className="modal-subtitle">Sign in to continue thrifting</p>

        <div className="login-form">
          { validLogin && 
            <p className="error-login">
              <CircleAlert size={16} /> Invalid email or password
            </p>
          }
          <input type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <button onClick={handleSubmit} className="submit-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <div className="modal-footer">
          <p>
            Don't have an account? <Link to='/signup' onClick={handleClose}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Navbar({ openLoginModal }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    if (openLoginModal){
      setIsLoginOpen(true);
    }}, [openLoginModal]
  )

  return (
    <>
      <div className="navbar-container">
        <div className="navlogo">
          <h1>Thrifty</h1>
        </div>
        <div className="navbuttons">
          <button className="login-btn" onClick={() => setIsLoginOpen(true)}>Login</button>
          <Link to="/signup" className="signup-btn">Sign Up</Link>
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
      />
    </>
  );
}

export default Navbar;