import { useState } from 'react';
import Titlebar from '../components/Titlebar.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { Camera, Upload, X } from 'lucide-react';
import { API_BASE_URL } from '../config'
import './SellItems.css';

function SellItems() {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages([...images, ...newImages].slice(0, 5));
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('{API_BASE_URL}/api/swipe/additem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          category,
          condition,
          imageUrl: images[0] || null
        })
      });

      if (response.ok) {
        alert('Item listed successfully!');
        setTitle('');
        setDescription('');
        setPrice('');
        setCategory('');
        setCondition('');
        setImages([]);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to list item');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to list item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sellItems-container">
      <Sidebar />
      <div className="container">
        <Titlebar />

        <div className="sell-form-container">
          <h1 className="sell-title">List an Item</h1>
          <p className="sell-subtitle">Fill in the details to list your item for sale</p>

          <form onSubmit={handleSubmit} className="sell-form">
            <div className="image-upload-section">
              <label className="section-label">Photos</label>
              <div className="image-upload-area">
                {images.length < 5 && (
                  <label className="upload-button">
                    <Camera size={32} />
                    <span>Add Photos</span>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      hidden 
                    />
                  </label>
                )}
                {images.map((img, index) => (
                  <div key={index} className="preview-image">
                    <img src={img} alt={`Preview ${index + 1}`} />
                    <button 
                      type="button" 
                      className="remove-image"
                      onClick={() => removeImage(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <span className="helper-text">Add up to 5 photos</span>
            </div>

            <div className="form-group">
              <label className="section-label">Title</label>
              <input
                type="text"
                placeholder="What are you selling?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="section-label">Description</label>
              <textarea
                placeholder="Describe your item..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input form-textarea"
                rows={4}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="section-label">Price</label>
                <div className="price-input">
                  <span className="currency">₱</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="section-label">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input form-select"
                  required
                >
                  <option value="">Select category</option>
                  <option value="clothing">Clothing</option>
                  <option value="shoes">Shoes</option>
                  <option value="accessories">Accessories</option>
                  <option value="electronics">Electronics</option>
                  <option value="furniture">Furniture</option>
                  <option value="books">Books</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="section-label">Condition</label>
              <div className="condition-options">
                {['New', 'Like New', 'Good', 'Fair'].map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    className={`condition-button ${condition === cond ? 'active' : ''}`}
                    onClick={() => setCondition(cond)}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? (
                'Listing...'
              ) : (
                <>
                  <Upload size={20} />
                  List Item
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SellItems;
