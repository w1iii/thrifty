// Navbar.jsx
import { useState, useEffect } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CircleAlert} from 'lucide-react';
import { useAuth } from '../authContext.jsx'
import { Link } from 'react-router-dom'
import "./Navbar.css";

function LoginModal({ isOpen, onClose, onSwitchToSignup }) {
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [validLogin , setValidLogin] = useState(false)
  const { login } = useAuth()

  const navigate = useNavigate()



  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const res = await axios.post('http://localhost:5050/api/auth/login', { email, password })
      console.log(res.data)
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    }catch(err){
      setValidLogin(true)
      console.log(err)
    }
  };

  function handleClose(){
    onClose()
    setValidLogin(false)

  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content-form" onClick={(e) => e.stopPropagation()}>
        <h2>Login</h2>

        <div className="login-form">
          { validLogin && 
            <p className="error-login">
              <CircleAlert /> Invalid username and password.
            </p>
          }
          <input type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Username"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <button onClick={handleSubmit} className="submit-button">
            Submit
          </button>
        </div>

        <div className="modal-footer">
          <p>
            Looking to <Link to='/signup'> create an account</Link>?
          </p>
        </div>
      </div>
    </div>
  );
}

function Navbar({ openLoginModal }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  useEffect(() => {
    if (openLoginModal){
    setIsLoginOpen(true);
    }}, [openLoginModal]
  )

  const switchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const switchToLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <>
      <div className="navbar-container">
        <div className="navlogo">
          <h1>Thrifty</h1>
        </div>
        <div className="navbuttons">
          <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginOpen(true); }}>Login</a>
          <Link to="/signup"> Sign up</Link>
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignup={switchToSignup}
      />
 
    </>
  );
}

export default Navbar;
