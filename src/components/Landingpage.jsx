import Navbar from './Navbar.jsx'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import './Landingpage.css'


function Landingpage(){
  const [ openLogin, setOpen ] = useState(false)

  function handleClick(){
    setOpen(prev => !prev)

  }

  return(
    <>
      <Navbar 
        openLoginModal = {openLogin}
      />

      <div className="main-container">
        <h1>Thrifty</h1>
        <h2>Swipe. Save. Discover thrift gems.</h2>
        <p>Thrifty turns thrifting into a simple swipe experience. Browse a personalized feed of secondhand gems, swipe right to save, left to skip, and discover amazing deals—all in one smooth.</p>
        <button className="thrift-btn" onClick = { () => handleClick()}>Start thrifting </button>
        <a href="" target="_self" className="browse-link">Browse as guest -</a>
      </div>
    </>

  )
}

export default Landingpage
