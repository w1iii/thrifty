import { User, Search, FolderHeart, ShoppingCart, Settings, HandHelping, LogOut, MessageCircleHeart  } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  return (
    <>
      <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Profile Section */}
        <div>
          <div className="profile-section">
            <h1 className="profile-title">Name</h1>
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
      <div className="main-content">
        {/* Header with Search */}
        <div className="header">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
            <button className="search-button">
              <Search size={24} />
            </button>
          </div>
          <div className="inbox-text"><button><MessageCircleHeart className="messages-icon"/></button></div>
        </div>

        {/* Content Card with Shapes */}
        <div className="content-wrapper">
          <div className="content-card">
            <div className="shapes-container">
              {/* Triangle */}
              <div className="shape-circle">
                <div className="triangle"></div>
              </div>
              
              {/* Bottom Row - Star and Square */}
              <div className="bottom-shapes">
                {/* Star shape */}
                <div className="shape-circle">
                  <svg viewBox="0 0 24 24" className="star-svg">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                
                {/* Square */}
                <div className="square"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Dashboard;
