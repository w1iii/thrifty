import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../authContext.jsx";
import Titlebar from "../components/Titlebar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import "./SavedItems.css";
import gif from '../assets/empty.gif'

function SavedItems() {
  const { token: contextToken, isLoading } = useAuth();

  // Fallback token from localStorage for testing/dev
  const token = contextToken || localStorage.getItem("token");

  const [selectedItem, setSelectedItem] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoadingItems(false);
      return;
    }

    const loadSavedItems = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/items/saved", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data)

        const normalized = Array.isArray(res.data)
          ? res.data.map((item) => ({
              id: item.id,
              title: item.title || "Untitled",
              image: item.image_url || "/placeholder.png",
              price: item.price ? `$${item.price}` : "N/A",
              size: item.size || "N/A",
              condition: item.condition || "N/A",
            }))
          : [];

        setSavedItems(normalized);
      } catch (err) {
        console.error("Failed to load saved items:", err);
      } finally {
        setLoadingItems(false);
      }
    };

    loadSavedItems();
  }, [token]);

  return (
    <div className="savedItems-container">
      <Sidebar />
      <div className="container">
        <Titlebar />

        {loadingItems && <p>Loading saved items...</p>}
        {!loadingItems && !token && <p>Please log in to view saved items.</p>}

        <div className="gallery">
          {savedItems.length === 0 && !loadingItems ? (
            <div className="no-items-message">
              <img
                src={gif} // optional image in public folder
                alt="No items"
                className="no-items-image"
              />
              <h2>No saved items yet</h2>
              <p>Start browsing items and swipe right to save your favorites!</p>
              <button
                className="browse-button"
                onClick={() => window.location.href = "/dashboard"}
              >
                Browse Items
              </button>
            </div>
          ) : (
            <div className="grid">
              {savedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="card"
                >
                  <div className="image-container">
                    <img src={item.image} alt={item.title} className="image" />
                  </div>
                  <div className="card-text">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-price">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedItem && (
          <div className="modal" onClick={() => setSelectedItem(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="close-button"
                onClick={() => setSelectedItem(null)}
              >
                X
              </button>

              <div className="modal-left">
                <div className="modal-image-container">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="modal-image"
                  />
                </div>
              </div>

              <div className="modal-right">
                <div className="modal-actions-top">
                  <button className="action-button">BUY</button>
                  <button className="action-button">STEAL</button>
                </div>

                <div className="modal-details-box">
                  <div className="details-content">
                    <h2 className="modal-title">{selectedItem.title}</h2>
                    <div className="modal-info">
                      <span className="modal-price">{selectedItem.price}</span>
                      <span>•</span>
                      <span className="modal-text">{selectedItem.size}</span>
                      <span>•</span>
                      <span className="modal-text">{selectedItem.condition}</span>
                    </div>
                  </div>
                </div>

                <button className="message-button">MESSAGE</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedItems;

