import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Sidebar from '../components/Sidebar.jsx'
import './SellItemPage.css';

export default function SellItemPage() {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    price: '',
    category: '',
    size: '',
    gender: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: null }));
  };

  const handleSubmit = async () => {
    if (!formData.itemName || !formData.price || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }

    try{
      const response = await axios.post("http://localhost:5050/api/items/createItem", { title: formData.itemName, description: formData.description,  price: formData.price, category: formData.category, size: formData.size, gender: formData.gender, image_url: formdata.image})
      if (!response) return console.log("error server")
      alert('Item successfully added')
      console.log(response.data)

    }catch(err){
      console.log(err)
    }
    setSubmitted(true);
    // submit backend
    
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        itemName: '',
        description: '',
        price: '',
        category: '',
        size: '',
        gender: '',
        image: null,
      });
      setImagePreview(null);
    }, 2000);
  };

  const handleSaveDraft = () => {
    alert('Draft saved! You can continue editing later.');
  };

  return (
    <>
      <Sidebar />
    <div className="sell-item-container">
      <div className="sell-item-wrapper">
        <h1 className="sell-item-title">Sell an Item</h1>
        <p className="sell-item-subtitle">Share your vintage finds with the community</p>

        {submitted && (
          <div className="success-message">
            ✓ Your item has been listed successfully!
          </div>
        )}

        <div className="form-container">
          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">Item Photo *</label>
            {!imagePreview ? (
              <label className="image-upload-box">
                <div className="upload-content">
                  <Upload size={40} />
                  <p className="upload-text">Click to upload or drag and drop</p>
                  <p className="upload-subtext">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            ) : (
              <div className="image-preview-box">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="preview-image"
                />
                <button
                  onClick={handleRemoveImage}
                  className="remove-image-btn"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Item Name */}
          <div className="form-group">
            <label className="form-label">Item Name *</label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              placeholder="e.g., Vintage Denim Jacket"
              className="form-input"
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add details about condition, material, brand, etc."
              rows="4"
              className="form-textarea"
            />
          </div>

          {/* Price */}
          <div className="form-group">
            <label className="form-label">Price (PHP) *</label>
            <div className="price-input-wrapper">
              <span className="price-symbol">P</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="form-input price-input"
              />
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select a category</option>
              <option value="clothing">Clothing</option>
              <option value="shoes">Shoes</option>
              <option value="accessories">Accessories</option>
              <option value="bags">Bags</option>
              <option value="outerwear">Outerwear</option>
              <option value="vintage">Vintage</option>
            </select>
          </div>

          {/* Size and Color */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                placeholder="e.g., M, Large, 10"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select gender</option>
              <option value="clothing">Male</option>
              <option value="shoes">Female</option>
              <option value="accessories">Unisex</option>
            </select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="button-group">
            <button
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              List Item
            </button>
            <button
              onClick={handleSaveDraft}
              className="btn btn-secondary"
            >
              Save Draft
            </button>
          </div>
        </div>

        <p className="form-note">
          * Required fields. Your item will be reviewed before going live.
        </p>
      </div>
    </div>
  </>
  );
}
