import {
  Heart,
  X,
  RefreshCw
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../authContext";
import axios from "axios";
import "./Cards.css";

function Cards() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [action, setAction] = useState("");
  const [loading, setLoading] = useState(true);

  const cardRef = useRef(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5050/api/swipe/items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
      setCurrentIndex(0);
    } catch (err) {
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (swipeAction) => {
    const currentItem = items[currentIndex];
    if (!currentItem) return;

    try {
      await axios.post(
        "http://localhost:5050/api/swipe/swipe",
        { itemId: currentItem.id, action: swipeAction },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to record swipe:", err);
    }
  };

  const swipeRight = async () => {
    setDragOffset({ x: 300, y: 0 });
    await handleSwipe("liked");
    setTimeout(() => {
      setCurrentIndex((p) => p + 1);
      reset();
    }, 300);
  };

  const swipeLeft = async () => {
    setDragOffset({ x: -300, y: 0 });
    await handleSwipe("passed");
    setTimeout(() => {
      setCurrentIndex((p) => p + 1);
      reset();
    }, 300);
  };

  const handleStart = (x, y) => {
    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleMove = (x, y) => {
    if (!isDragging) return;
    const dx = x - dragStart.x;
    setDragOffset({ x: dx, y: y - dragStart.y });

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

  const reset = () => {
    setDragOffset({ x: 0, y: 0 });
    setAction("");
  };

  const rotation = dragOffset.x / 20;

  if (loading) {
    return (
      <div className="cards-page">
        <div className="header">
          <h1 className="header-title"> Thrifty </h1>
        </div>
        <div className="loading-container">
          <RefreshCw className="spin" size={40} />
          <p>Loading items...</p>
        </div>
      </div>
    );
  }

  if (!items.length || currentIndex >= items.length) {
    return (
      <div className="cards-page">
        <div className="header">
          <h1 className="header-title"> Thrifty </h1>
        </div>
        <div className="empty-state">
          <p>No more items to browse</p>
          <button onClick={fetchItems} className="refresh-btn">
            <RefreshCw size={20} />
            Load More
          </button>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div className="cards-page">
      <div className="header">
        <h1 className="header-title"> Thrifty </h1>
      </div>

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
          <img src={currentItem.image_url} className="card-image" alt={currentItem.title} />

          {action === "save" && <div className="overlay save">SAVE</div>}
          {action === "skip" && <div className="overlay skip">SKIP</div>}

          <div className="gradient" />
          <div className="info">
            <h2>{currentItem.title}</h2>
            <div className="meta">
              <span className="price">₱{currentItem.price}</span>
              <span className="badge">Size {currentItem.size}</span>
            </div>
          </div>
        </div>

        <div className="actions">
          <button onClick={swipeLeft} className="btn">
            <X className="icon red" />
          </button>
          <button onClick={swipeRight} className="btn">
            <Heart className="icon green" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cards;
