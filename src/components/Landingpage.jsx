import Navbar from './Navbar.jsx'
import { Link } from 'react-router-dom'
import './Landingpage.css'

function Landingpage(){

  return(
    <>
      <Navbar />

      <div className="main-container">
        <h1>Thrifty</h1>
        <h2>Swipe. Save. Discover thrift gems.</h2>
        <p>Thrifty turns thrifting into a simple swipe experience. Browse a personalized feed of secondhand gems, swipe right to save, left to skip, and discover amazing deals—all in one smooth.</p>
        <Link to="/dashboard"> <button className="thrift-btn">Start thrifting </button> </Link>
        <a href="" target="_self" className="browse-link">Browse as guest -</a>
      </div>
    </>

  )
}

export default Landingpage
