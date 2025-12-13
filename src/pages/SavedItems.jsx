import {
  Search,
  MessageCircleHeart
} from "lucide-react";
import Titlebar from '../components/Titlebar.jsx'

import { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx'
import './SavedItems.css'

function SavedItems() {
  const [selectedItem, setSelectedItem] = useState(null);

  const items = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
      title: 'Vintage Denim Jacket',
      price: '$45',
      size: 'Size M',
      condition: 'Like New'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
      title: 'Classic Leather Bag',
      price: '$65',
      size: 'Medium',
      condition: 'Good'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1613486031954-e94f0b90ce31?w=400&h=400&fit=crop',
      title: 'Retro Sneakers',
      price: '$38',
      size: 'Size 9',
      condition: 'Like New'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
      title: 'Vintage Sunglasses',
      price: '$25',
      size: 'One Size',
      condition: 'Excellent'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=400&fit=crop',
      title: 'Wool Cardigan',
      price: '$42',
      size: 'Size L',
      condition: 'Good'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop',
      title: 'Silk Scarf',
      price: '$18',
      size: 'One Size',
      condition: 'Like New'
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=400&h=400&fit=crop',
      title: 'Vintage Watch',
      price: '$95',
      size: 'Adjustable',
      condition: 'Excellent'
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop',
      title: 'Corduroy Pants',
      price: '$35',
      size: 'Size 32',
      condition: 'Good'
    }
  ];

  return (
    <>
      <div className="savedItems-container">
        <Sidebar />
        <div className="container">
          {/* Header */} 
          <Titlebar />

          {/* Gallery Grid */}
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
                      src={item.image}
                      alt={item.title}
                      className="image"
                    />
                  </div>
                  <div className="card-text">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-price">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zoomed Modal */}
          {/* Zoomed Modal */}
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
      
    </>
  );
};

export default SavedItems

