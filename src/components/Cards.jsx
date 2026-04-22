import {
  Heart,
  X,
  RefreshCw,
  ShoppingBag,
  SlidersHorizontal
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
      <div className="flex-1 ml-64 min-h-screen p-8 lg:p-12 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin w-10 h-10 text-indigo-600 mx-auto mb-4" />
          <p className="text-stone-500">Loading items...</p>
        </div>
      </div>
    );
  }

  if (!items.length || currentIndex >= items.length) {
    return (
      <div className="flex-1 ml-64 min-h-screen p-8 lg:p-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500 mb-4">No more items to browse</p>
          <button onClick={fetchItems} className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors">
            Load More
          </button>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div className="flex-1 ml-64 min-h-screen p-8 lg:p-12">
      <header className="max-w-4xl mx-auto mb-12 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2 block">Curated For You</span>
          <h2 className="text-3xl text-on-background" style={{ fontFamily: 'Noto Serif', fontWeight: 700 }}>Daily Discovery</h2>
        </div>
        <div className="flex gap-4 mb-2">
          <div className="p-3 bg-white rounded-full shadow-sm cursor-pointer hover:bg-stone-50 transition-colors">
            <SlidersHorizontal size={20} className="text-stone-600" />
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto">
        <div className="relative group">
          <div
            ref={cardRef}
            className={`relative aspect-[4/5] md:aspect-[16/10] overflow-hidden rounded-[32px] discovery-card-shadow bg-surface-container ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
              transition: isDragging ? "none" : "transform 0.3s ease-out"
            }}
            onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
            onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
            onTouchEnd={handleEnd}
          >
            <img 
              src={currentItem.image_url} 
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105" 
              alt={currentItem.title} 
            />

            {action === "save" && (
              <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                <span className="text-6xl font-bold text-green-600 bg-white px-8 py-4 rounded-2xl">SAVE</span>
              </div>
            )}
            {action === "skip" && (
              <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center">
                <span className="text-6xl font-bold text-red-600 bg-white px-8 py-4 rounded-2xl">SKIP</span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent flex flex-col justify-end p-8 md:p-12">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 md:p-8 max-w-md shadow-xl border border-white/20">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl text-stone-900 mb-1" style={{ fontFamily: 'Noto Serif', fontWeight: 600 }}>{currentItem.title}</h3>
                    <p className="text-stone-500">Pre-loved • Excellent Condition</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl text-indigo-600 font-bold">₱{currentItem.price}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 border-t border-stone-200 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400 text-sm uppercase font-bold tracking-wider">Size</span>
                    <span className="bg-stone-900 text-white w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold">{currentItem.size}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-400 text-sm uppercase font-bold tracking-wider">Seller</span>
                    <span className="text-stone-900 font-semibold text-sm underline underline-offset-4 decoration-indigo-200">TheThriftStore_PH</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 z-10">
            <button 
              onClick={swipeLeft} 
              className="w-16 h-16 rounded-full bg-white text-stone-900 shadow-xl border border-stone-100 flex items-center justify-center hover:bg-stone-50 active:scale-90 transition-all duration-200"
            >
              <X size={32} className="group-hover:rotate-12 transition-transform" />
            </button>
            <button 
              onClick={swipeRight} 
              className="w-20 h-20 rounded-full bg-indigo-600 text-white shadow-[0_15px_30px_-5px_rgba(69,30,187,0.4)] flex items-center justify-center hover:bg-indigo-700 active:scale-90 transition-all duration-200"
            >
              <Heart size={36} fill="currentColor" />
            </button>
            <button 
              className="w-16 h-16 rounded-full bg-white text-stone-900 shadow-xl border border-stone-100 flex items-center justify-center hover:bg-stone-50 active:scale-90 transition-all duration-200"
            >
              <ShoppingBag size={32} className="hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="mt-20 text-center">
          <p className="text-stone-400 max-w-sm mx-auto">
            Based on your interest in <span className="text-stone-900 font-semibold">90s Outerwear</span> and <span className="text-stone-900 font-semibold">Sustainable Brands</span>.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto mt-32">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl" style={{ fontFamily: 'Noto Serif', fontWeight: 600 }}>Rising Collections</h3>
          <a className="text-indigo-600 font-bold text-sm uppercase tracking-widest border-b-2 border-indigo-100 hover:border-indigo-600 transition-colors" href="#">View All</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 group cursor-pointer">
            <div className="relative h-96 overflow-hidden rounded-[24px] bg-stone-100 shadow-sm transition-all duration-500 hover:shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt="Summer Linen" 
              />
              <div className="absolute inset-0 flex flex-col justify-end p-8 z-20">
                <span className="text-white/80 text-[10px] font-bold tracking-widest mb-2 uppercase">New Drop</span>
                <h4 className="text-white text-2xl mb-4" style={{ fontFamily: 'Noto Serif', fontWeight: 600 }}>Summer Minimalist</h4>
                <button className="w-fit bg-white text-stone-900 px-6 py-2 rounded-full font-bold text-sm">Explore</button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-8">
            <div className="flex-1 relative overflow-hidden rounded-[24px] group cursor-pointer shadow-sm hover:shadow-xl transition-all">
              <img 
                src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt="Designer Heels" 
              />
              <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-bold text-sm tracking-widest uppercase">Luxury Shoes</span>
              </div>
            </div>
            
            <div className="flex-1 relative overflow-hidden rounded-[24px] cursor-pointer shadow-sm hover:shadow-xl transition-all bg-indigo-50 flex items-center justify-center p-8 text-center">
              <div>
                <Heart size={40} className="text-indigo-600 mx-auto mb-4" />
                <h4 className="text-stone-900 font-bold mb-2">Sell Your Closet</h4>
                <p className="text-stone-500 text-sm">Earn up to 85% of each sale with our premium protection.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-32 border-t border-stone-100 pt-12 pb-8 flex flex-col md:flex-row justify-between items-center text-stone-400 text-sm">
        <p>© 2024 Thrifty Market. All rights reserved.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a className="hover:text-stone-900 transition-colors" href="#">Instagram</a>
          <a className="hover:text-stone-900 transition-colors" href="#">Twitter</a>
          <a className="hover:text-stone-900 transition-colors" href="#">TikTok</a>
        </div>
      </footer>
    </div>
  );
}

export default Cards;