import './Dashboard.css';
import { useAuth } from '../authContext.jsx'
import { User, Search, PhilippinePeso, FolderHeart, ShoppingCart, House, Settings, HandHelping, LogOut, MessageCircleHeart  } from 'lucide-react';
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
            <Link to="/settings" className="nav-link"><PhilippinePeso />Sell an item </Link>
            <Link to="/settings" className="nav-link"><Settings />Settings </Link>
          </nav>
        </div>

        {/* Footer Links */}
        <div className="footer-links">
          <h2 className="nav-item"><HandHelping /> Help and support</h2>
          <Link to="/" className="nav-item"><LogOut /> Logout</Link>
        </div>
      </div>
    </>
  );
}

export default Sidebar;

