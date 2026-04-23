import './Titlebar.css'
import {
  Search,
  MessageCircleHeart
} from "lucide-react";

function Titlebar(){
  return(
      <div className="header"> 
        <div className="search-container">
        <input placeholder="search..." className="search-input" />
          <button className="search-button">
            <Search size={20} />
          </button>
        </div>
      </div>
  )
}


export default Titlebar;
