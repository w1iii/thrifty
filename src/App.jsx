import { Routes, Route, Navigate } from "react-router-dom"
import Landingpage from './components/Landingpage.jsx'
import Dashboard from './components/Dashboard.jsx'
import SavedItems from './pages/SavedItems.jsx'
import Settings from './pages/Settings.jsx'
import SignupPage from './pages/SignupPage.jsx'
import { useAuth } from './authContext.jsx'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to = "/" />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landingpage />}/>
      <Route path="/signup" element={<SignupPage />}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/saveditems" element={<SavedItems/>}/>
      <Route path="/settings" element={<Settings/>}/>
    </Routes>
  )
}

export default App
