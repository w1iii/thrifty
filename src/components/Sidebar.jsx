import './Dashboard.css';
import { useAuth } from '../authContext.jsx'
import { User, PhilippinePeso, FolderHeart, House, Settings, HandHelping, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await axios.post("http://localhost:5050/api/auth/logout")
    } catch (e) {
      console.log(e)
    }
    logout()
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <>
      <div className="sidebar">
        <div>
          <div className="profile-section">
            <h1 className="profile-title">{user?.username}</h1>
            <User size={48} className="profile-icon" />
          </div>

          <nav className="nav-links">
            <Link to="/dashboard" className="nav-link"><House /> Home </Link>
            <Link to="/saveditems" className="nav-link"><FolderHeart />Saved items </Link>
            <Link to="/sellItems" className="nav-link"><PhilippinePeso />Sell an item </Link>
            <Link to="/settings" className="nav-link"><Settings />Settings </Link>
          </nav>
        </div>

        <div className="footer-links">
          <h2 className="nav-item"><HandHelping /> Help and support</h2>
          <p onClick={handleLogout} className="nav-item"><LogOut /> Logout</p>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
