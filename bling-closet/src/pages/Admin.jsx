import React, { useState, useEffect } from 'react';
import './Admin.css';
import API_URL from '../config/api';

function Admin() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'Uncategorized',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [editingId, setEditingId] = useState(null);

  // Fetch existing items on load
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/items`);
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({ title: '', price: '', category: 'Uncategorized', description: '' });
    setImage(null);
    setImagePreview(null);
    setEditingId(null);
    const fileInput = document.getElementById('image-input');
    if (fileInput) fileInput.value = '';
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      price: item.price,
      category: item.category || 'Uncategorized',
      description: item.description || '',
    });
    setImage(null);
    setImagePreview(item.imageUrl);
    const fileInput = document.getElementById('image-input');
    if (fileInput) fileInput.value = '';
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('description', formData.description);
      if (image) {
        data.append('image', image);
      }

      const isEditing = editingId !== null;
      const url = isEditing ? `${API_URL}/api/items/${editingId}` : `${API_URL}/api/items`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: data });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || `Failed to ${isEditing ? 'update' : 'create'} item`);
      }

      const savedItem = await res.json();

      if (isEditing) {
        setItems(items.map((item) => (item._id === editingId ? savedItem : item)));
        setMessage({ type: 'success', text: `"${savedItem.title}" updated successfully!` });
      } else {
        setItems([savedItem, ...items]);
        setMessage({ type: 'success', text: `"${savedItem.title}" added successfully!` });
      }

      resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This will also remove the image from storage.`)) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/items/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item');

      setItems(items.filter((item) => item._id !== id));
      setMessage({ type: 'success', text: `"${title}" deleted successfully!` });

      // If we were editing the deleted item, reset the form
      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <div className="admin-page">
      <h1>✨ Admin Panel</h1>

      {/* Upload/Edit Form */}
      <div className="upload-form">
        <h2>{editingId ? '✏️ Edit Item' : 'Add New Item'}</h2>

        {message.text && (
          <div className={message.type === 'success' ? 'success-msg' : 'error-msg'}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Pink Ruffle Top"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="29.99"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="Uncategorized">Select category...</option>
                <option value="Tops">Tops</option>
                <option value="Dresses">Dresses</option>
                <option value="Bottoms">Bottoms</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Accessories">Accessories</option>
                <option value="Shoes">Shoes</option>
                <option value="Bags">Bags</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the item..."
            />
          </div>

          <div className="form-group">
            <label>Product Image {editingId ? '(leave empty to keep current)' : ''}</label>
            <div className="image-upload-area">
              <input
                type="file"
                id="image-input"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
              />
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              ) : (
                <>
                  <div className="upload-icon">📷</div>
                  <p><strong>Click to upload</strong> or drag and drop</p>
                  <p>JPG, PNG, GIF or WebP (max 5MB)</p>
                </>
              )}
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (editingId ? 'Updating...' : 'Uploading...') : (editingId ? '✏️ Update Item' : '✨ Add Item')}
          </button>

          {editingId && (
            <button type="button" className="cancel-btn" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Items List */}
      <div className="items-list">
        <h2>Current Items ({items.length})</h2>
        {items.length === 0 ? (
          <p className="no-items">No items yet. Add your first one above!</p>
        ) : (
          <div className="items-grid">
            {items.map((item) => (
              <div key={item._id} className={`admin-item-card ${editingId === item._id ? 'editing' : ''}`}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }}
                />
                <div className="admin-item-info">
                  <h3>{item.title}</h3>
                  <div className="item-category">{item.category}</div>
                  <div className="item-price">${Number(item.price).toFixed(2)}</div>
                  {item.description && <div className="item-desc">{item.description}</div>}
                  <div className="item-actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(item)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item._id, item.title)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
