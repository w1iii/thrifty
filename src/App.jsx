import { useState } from 'react'
import { Routes, Route } from "react-router-dom"
import Landingpage from './components/Landingpage.jsx'
import Dashboard from './components/Dashboard.jsx'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Landingpage />}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
    </Routes>
  )
}

export default App
