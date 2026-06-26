import { Routes, Route, Navigate } from "react-router-dom"
import Landingpage from './components/Landingpage.jsx'
import Dashboard from './components/Dashboard.jsx'
import SavedItems from './pages/SavedItems.jsx'
import Settings from './pages/Settings.jsx'
import SignupPage from './pages/SignupPage.jsx'
import SellItems from './pages/SellItems.jsx'
import { useAuth } from './authContext.jsx'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to = "/" />
}

function App() {
  return (
    <>
      <div className="animated-bg">
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />
        <div className="gradient-orb gradient-orb-4" />
      </div>
      <Routes>
        <Route path="/" element={<Landingpage />}/>
        <Route path="/signup" element={<SignupPage />}/>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/saveditems" element={<ProtectedRoute><SavedItems /></ProtectedRoute>}/>
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>}/>
        <Route path="/sellItems" element={<ProtectedRoute><SellItems /></ProtectedRoute>}/>
      </Routes>
    </>
  )
}

export default App
