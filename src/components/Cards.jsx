import {
  Heart,
  X,
} from "lucide-react"
import { useState, useRef } from "react"
import "./Cards.css"
import { useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../authContext';


function Cards() {
  const { token } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [action, setAction] = useState("")
  const [itemData, setItems] = useState([])

  const currentItem = itemData[currentIndex];
  const cardRef = useRef(null);

  useEffect(()=>{
    const getItems = async () => {
      try{
        const res = await axios.get('http://localhost:5050/api/items', {
          headers:{
          Authorization: `Bearer ${token}`,
          }
        })
        setItems(res.data)
      }catch(err){
        console.log(err)
      }
    }
    getItems()
  },[])

  useEffect(() => {
    console.log('itemData updated:', itemData);
  }, [itemData]);

  if (itemData.length === 0) {
    return (
      <div className="cards-page">
        <div className="header">
          <h1 className="header-title"> Thrifty </h1>
        </div>

        <div className="home-card-container">
          <p style={{ textAlign: "center" }}>No items available</p>
        </div>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="cards-page">
        <div className="header">
          <h1 className="header-title"> Thrifty </h1>
        </div>

        <div className="home-card-container">
          <p style={{ textAlign: "center" }}>Loading items...</p>
        </div>
      </div>
    );
  }

  const handleStart = (x, y) => {
    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleMove = (x, y) => {
    if (!isDragging) return;
    const dx = x - dragStart.x;
    const dy = y - dragStart.y;
    setDragOffset({ x: dx, y: dy });

    if (dx > 50) setAction("save");
    else if (dx < -50) setAction("skip");
    else setAction("");
  };

  const handleEnd = () => {
    setIsDragging(false);
    const t = 100;

    if (dragOffset.x > t) swipeRight();
    else if (dragOffset.x < -t) swipeLeft();
    else reset();
  };

  async function swipeRight() {
    console.log('swiped right');
    console.log(currentItem);
    
    try {
      const res = await axios.post(
        'http://localhost:5050/api/items/swipe',
        {
          item_id: currentItem.id,
          action: 'liked'
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (res.status === 201) {
        console.log('Saved item:', res.data);
      } else if (res.status === 409) {
        console.log('Already swiped on this item');
      }
    } catch(err) {
      if (err.response?.status === 409) {
        console.log('Duplicate swipe - already swiped on this item');
      } else {
        console.error('Error saving item:', err);
      }
    }

    setDragOffset({ x: 300, y: 0 });
    setTimeout(() => {
      setCurrentIndex((p) => (p + 1) % itemData.length);
      reset();
    }, 300);
  }

  async function swipeLeft() {
    console.log('swiped left');
    console.log(currentItem);
    
    try {
      const res = await axios.post(
        'http://localhost:5050/api/items/swipe',
        {
          item_id: currentItem.id,
          action: 'skipped'
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (res.status === 201) {
        console.log('Skipped item:', res.data);
      } else if (res.status === 409) {
        console.log('Already swiped on this item');
      }
    } catch(err) {
      if (err.response?.status === 409) {
        console.log('Duplicate swipe - already swiped on this item');
      } else {
        console.error('Error skipping item:', err);
      }
    }

    setDragOffset({ x: -300, y: 0 });
    setTimeout(() => {
      setCurrentIndex((p) => (p + 1) % itemData.length);
      reset();
    }, 300);
  }

  const reset = () => {
    setDragOffset({ x: 0, y: 0 });
    setAction("");
  };

  const rotation = dragOffset.x / 20;

  return (
    <div className="cards-page">
      {/* Header */}
      <div className="header"> 
        <h1 className="header-title"> Thrifty </h1>
      </div>

      {/* Cards */}
      <div className="home-card-container">
        <div
          ref={cardRef}
          className={`center-card ${isDragging ? "dragging" : ""}`}
          style={{
            transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`
          }}
          onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
          onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) =>
            handleStart(e.touches[0].clientX, e.touches[0].clientY)
          }
          onTouchMove={(e) =>
            handleMove(e.touches[0].clientX, e.touches[0].clientY)
          }
          onTouchEnd={handleEnd}
        >
          <img src={currentItem.image_url} className="card-image" />

          {action === "save" && <div className="overlay save">SAVE</div>}
          {action === "skip" && <div className="overlay skip">SKIP</div>}
          {action === "message" && (
            <div className="overlay message">MESSAGE</div>
          )}

          <div className="gradient" />
          <div className="info">
            <h2>{currentItem.title}</h2>
            <div className="meta">
              <span className="price">{currentItem.price}</span>
              <span className="badge">Size {currentItem.size}</span>
              <span className="badge">{currentItem.gender}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="actions">
          <button onClick={() => swipeLeft()} className="cards-btn">
            <X className="icon red" />
          </button>
          <button onClick={() => swipeRight()} className="cards-btn">
            <Heart className="icon green" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cards;
