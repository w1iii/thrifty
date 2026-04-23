import { useState, useEffect } from 'react';
import Titlebar from '../components/Titlebar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useAuth } from '../authContext';
import axios from 'axios';
import { API_BASE_URL } from '../config';
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
      const res = await axios.get(`${API_BASE_URL}/api/swipe/saved`, {
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
              className="modal-overlay"
              onClick={() => setSelectedItem(null)}
            >
              <div
                className="item-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="modal-close"
                  onClick={() => setSelectedItem(null)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                
                <div className="modal-image-section">
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.title}
                    className="modal-item-image"
                  />
                  <div className="image-badge">
                    <span>SAVED</span>
                  </div>
                </div>
                
                <div className="modal-details-section">
                  <div className="modal-header">
                    <h2 className="modal-item-title">{selectedItem.title}</h2>
                    <span className="modal-item-price">₱{selectedItem.price}</span>
                  </div>
                  
                  <div className="modal-meta">
                    <span className="meta-tag">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                      Size {selectedItem.size}
                    </span>
                    <span className="meta-tag">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                        <line x1="7" y1="7" x2="7.01" y2="7"></line>
                      </svg>
                      Thrifted
                    </span>
                  </div>
                  
                  <div className="modal-description-section">
                    <h3>Description</h3>
                    <p>{selectedItem.description || "No description provided."}</p>
                  </div>
                  
                  <div className="modal-seller-preview">
                    <div className="seller-avatar">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div className="seller-info">
                      <span className="seller-label">Seller</span>
                      <span className="seller-name">View Profile</span>
                    </div>
                  </div>
                  
                  <div className="modal-actions">
                    <button className="action-btn-secondary">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      Saved
                    </button>
                    <button className="action-btn-primary">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                      Message
                    </button>
                  </div>
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
