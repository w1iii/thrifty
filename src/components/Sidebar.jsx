import './Dashboard.css';
import { useAuth } from '../authContext.jsx'
import { User, Search, FolderHeart, ShoppingCart, House, Settings, HandHelping, LogOut, MessageCircleHeart  } from 'lucide-react';
import { Link } from 'react-router-dom'

function Sidebar() {
  const { user, logout } = useAuth()

  function navigateSaveItems(){
    navigate('/saveditems')
  }
  return (
    <>
      <div className="sidebar">
        {/* Profile Section */}
        <div>
          <div className="profile-section">
            <h1 className="profile-title">{user?.username}</h1>
            <User size={48} className="profile-icon" />
          </div>

          {/* Navigation Links */}
          <nav className="nav-links">
            <Link to="/dashboard" className="nav-link"><House /> Home </Link>
            <Link to="/saveditems" className="nav-link"><FolderHeart />Saved items </Link>
            <h2 className="nav-item"><Settings /> Settings</h2>
          </nav>
        </div>

        {/* Footer Links */}
        <div className="footer-links">
          <h2 className="nav-item"><HandHelping /> Help and support</h2>
          <h2 className="nav-item"><LogOut /> Logout</h2>
        </div>
      </div>
    </>
  );
}

export default Sidebar;

