import Cards from './Cards.jsx'
import Sidebar from './Sidebar.jsx'
import './Dashboard.css';


function Dashboard() {
  return (
    <>
      <div className="dashboard-container">
      {/* Sidebar */}
        <Sidebar />
      {/* Main Content Area */}
        <Cards />
        
      </div>
    </>
  );
}

export default Dashboard;
