// Navbar.jsx
import { useState, useEffect } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CircleAlert} from 'lucide-react';
import { useAuth } from '../authContext.jsx'
import "./Navbar.css";

function LoginModal({ isOpen, onClose, onSwitchToSignup }) {
  const [password, setPassword] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [validLogin , setValidLogin] = useState(false)
  const { login } = useAuth()

  const navigate = useNavigate()



  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const res = await axios.post('http://localhost:5050/api/auth/login', { identifier, password })
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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Login</h2>

        <div className="login-form">
          { validLogin && 
            <p className="error-login">
              <CircleAlert /> Invalid username and password.
            </p>
          }
          <input type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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
            Looking to <a onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }}>create an account</a>?
          </p>
        </div>
      </div>
    </div>
  );
}

function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  if (!isOpen) return null;


  const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    textAlign: "center",
    minWidth: "300px"
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    const validEmail = email.includes('@')
    const validPassword = password.length
    
    try{
      if(!validEmail) {
        setModalMessage("Enter a valid email address")
        setShowModal(true)
      }

      if(validPassword < 5){
        setModalMessage("Enter 6 characters password")
        setShowModal(true)
      }
      const res = await axios.post('http://localhost:5050/api/auth/signup', {username, email,password})
      navigate(0)

    }catch(err){
      if (err.response && err.response.status === 409) {
        setModalMessage("User already exists!")
        setShowModal(true)
      }
     else {
        console.log(err);
      }
    }

  };

  return (
    <div className="modal-overlay" onClick={() => {if(!showModal) onClose()}}>
      {showModal && (
        <div className="modal-backdrop" style={styles.backdrop}>
          <div className="modal" style={styles.modal}>
            <p>{modalMessage}</p>
            <button onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}

      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Sign Up</h2>

        <div className="login-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          <input
            type="email"
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

          <button onClick={handleSubmit} className="submit-button">
            Create Account
          </button>
        </div>

        <div className="modal-footer">
          <p>
            Already have an account? <a onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>Login</a>
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
          <a href="#" onClick={(e) => { e.preventDefault(); setIsSignupOpen(true); }}>Sign up</a>
        </div>
      </div>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignup={switchToSignup}
      />

      <SignupModal 
        isOpen={isSignupOpen} 
        onClose={() => setIsSignupOpen(false)}
        onSwitchToLogin={switchToLogin}
      />
    </>
  );
}

export default Navbar;
