import { User, Search, FolderHeart, ShoppingCart, Settings, HandHelping, LogOut, MessageCircleHeart  } from 'lucide-react';
import { useAuth } from '../authContext.jsx'
import Cards from './Cards.jsx'
import './Dashboard.css';

function Dashboard() {
  const { user, logout } = useAuth()
  return (
    <>
      <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Profile Section */}
        <div>
          <div className="profile-section">
            <h1 className="profile-title">{user?.username}</h1>
            <User size={48} className="profile-icon" />
          </div>

          {/* Navigation Links */}
          <nav className="nav-links">
            <h2 className="nav-item"><FolderHeart />Saved items </h2>
            <h2 className="nav-item"><ShoppingCart /> My orders</h2>
            <h2 className="nav-item"><Settings /> Settings</h2>
          </nav>
        </div>

        {/* Footer Links */}
        <div className="footer-links">
          <h2 className="nav-item"><HandHelping /> Help and support</h2>
          <h2 className="nav-item"><LogOut /> Logout</h2>
        </div>
      </div>


      {/* Main Content Area */}
        <Cards />
        
      </div>
    </>
  );
}

export default Dashboard;
