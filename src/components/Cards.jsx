import {
  Heart,
  X,
} from "lucide-react";
import { useState, useRef } from "react";
import "./Cards.css";

const items = [
  {
    id: 1,
    name: "Vintage Denim Jacket",
    price: "$45",
    size: "M",
    condition: "Like New",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop",
  },
  {
    id: 2,
    name: "Oversized Sweater",
    price: "$28",
    size: "L",
    condition: "Good",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop",
  },
];

function Cards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [action, setAction] = useState("");

  const cardRef = useRef(null);
  const currentItem = items[currentIndex];

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

    if (dragOffset.x > t) swipe("right");
    else if (dragOffset.x < -t) swipe("left");
    else reset();
  };

  function swipeRight() {
      setDragOffset({ x: 300, y: 0 })
      console.log('swiped right')
      setTimeout(() => {
      console.log('swiped right')
        setCurrentIndex((p) => (p + 1) % items.length);
        reset();
      }, 300);

  }
  function swipeLeft() {
      setDragOffset({ x: -300, y: 0 })
      console.log('swiped left')
      setTimeout(() => {
        setCurrentIndex((p) => (p + 1) % items.length);
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
          <img src={currentItem.image} className="card-image" />

          {action === "save" && <div className="overlay save">SAVE</div>}
          {action === "skip" && <div className="overlay skip">SKIP</div>}
          {action === "message" && (
            <div className="overlay message">MESSAGE</div>
          )}

          <div className="gradient" />
          <div className="info">
            <h2>{currentItem.name}</h2>
            <div className="meta">
              <span className="price">{currentItem.price}</span>
              <span className="badge">Size {currentItem.size}</span>
              <span className="badge">{currentItem.condition}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="actions">
          <button onClick={() => swipeLeft()} className="btn">
            <X className="icon red" />
          </button>
          <button onClick={() => swipeRight()} className="btn">
            <Heart className="icon green" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cards;

