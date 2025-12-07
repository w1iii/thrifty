// Navbar.jsx
import { useState } from 'react';
import "./Navbar.css";

function LoginModal({ isOpen, onClose, onSwitchToSignup }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { username, password });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Login</h2>

        <div className="login-form">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup attempt:', { username, email, password });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
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

function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

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
