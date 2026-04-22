import { useAuth } from '../authContext.jsx'
import { User, House, FolderHeart, Settings, HandHelping, LogOut, Heart, Plus, HelpCircle, Gavel, FileText } from 'lucide-react';
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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-stone-100 flex flex-col py-8 shadow-[20px_0_40px_-15px_rgba(0,0,0,0.05)] z-50">
      <div className="px-6">
        <h1 className="text-xl font-black text-stone-900 mb-8 tracking-tight" style={{ fontFamily: 'Noto Serif' }}>Thrifty</h1>
        <div className="flex items-center gap-3 mb-10 p-2">
          <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden flex items-center justify-center">
            <User size={24} className="text-stone-400" />
          </div>
          <div>
            <p className="font-bold text-stone-900 text-sm">{user?.username || 'Guest'}</p>
            <p className="text-xs text-stone-500 uppercase tracking-widest">Premium Member</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-stone-50 text-indigo-600 border-r-4 border-indigo-600 font-medium transition-all duration-300">
            <House size={20} />
            <span>Home</span>
          </Link>
          <Link to="/saveditems" className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 transition-all duration-300">
            <FolderHeart size={20} />
            <span>Saved Items</span>
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 transition-all duration-300">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <a className="flex items-center gap-3 px-4 py-3 text-stone-600 hover:bg-stone-50 transition-all duration-300" href="#">
            <HelpCircle size={20} />
            <span>Support</span>
          </a>
        </nav>
        
        <div className="mt-12 px-4">
          <Link to="/sellItems" className="block w-full py-3 bg-indigo-600 text-white rounded-full font-semibold text-sm shadow-md hover:bg-indigo-700 transition-colors active:scale-95 duration-200 text-center">
            Start Selling
          </Link>
        </div>
      </div>
      
      <div className="mt-auto px-6 border-t border-stone-100 pt-6">
        <div className="space-y-4">
          <a className="flex items-center gap-3 text-xs text-stone-400 hover:text-stone-900 transition-colors" href="#">
            <Gavel size={18} />
            <span>Privacy</span>
          </a>
          <a className="flex items-center gap-3 text-xs text-stone-400 hover:text-stone-900 transition-colors" href="#">
            <FileText size={18} />
            <span>Terms</span>
          </a>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;