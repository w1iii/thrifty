import { useState } from 'react'
import { Routes, Route, Navigate } from "react-router-dom"
import Landingpage from './components/Landingpage.jsx'
import Dashboard from './components/Dashboard.jsx'
import { useAuth } from './authContext.jsx'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to = "/" />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landingpage />}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
    </Routes>
  )
}

export default App
