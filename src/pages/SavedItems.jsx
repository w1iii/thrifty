import { useState, useEffect } from 'react';
import Titlebar from '../components/Titlebar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useAuth } from '../authContext';
import axios from 'axios';
import './SavedItems.css'

function SavedItems() {
  const { token, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchSavedItems();
  }, []);

  const fetchSavedItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5050/api/swipe/saved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.error("Failed to fetch saved items:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !token) {
    return (
      <div className="savedItems-container">
        <Sidebar />
        <div className="container">
          <Titlebar />
          <div className="empty-state">
            <p>Please log in to view saved items.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="savedItems-container">
        <Sidebar />
        <div className="container">
          <Titlebar />
          <div className="loading-container">
            <p>Loading saved items...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="savedItems-container">
        <Sidebar />
        <div className="container">
          <Titlebar />
          <div className="empty-state">
            <p>No saved items yet.</p>
            <p>Start swiping to save items you like!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="savedItems-container">
        <Sidebar />
        <div className="container">
          <Titlebar />

          <div className="gallery">
            <div className="grid">
              {items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="card"
                >
                  <div className="image-container">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="image"
                    />
                  </div>
                  <div className="card-text">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-price">₱{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedItem && (
            <div
              className="modal"
              onClick={() => setSelectedItem(null)}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="close-button"
                  onClick={() => setSelectedItem(null)}
                >
                  ✕
                </button>
                
                <div className="modal-left">
                  <div className="modal-image-container">
                    <img
                      src={selectedItem.image_url}
                      alt={selectedItem.title}
                      className="modal-image"
                    />
                  </div>
                </div>
                
                <div className="modal-right">
                  <div className="modal-details-box">
                    <div className="details-content">
                      <h2 className="modal-title">{selectedItem.title}</h2>
                      <p className="modal-description">{selectedItem.description}</p>
                      <div className="modal-info">
                        <span className="modal-price">₱{selectedItem.price}</span>
                        <span>•</span>
                        <span className="modal-text">Size {selectedItem.size}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="message-button">MESSAGE SELLER</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SavedItems;
