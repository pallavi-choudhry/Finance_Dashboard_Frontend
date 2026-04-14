import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const RecordForm = ({ record, onClose }) => {
  const [formData, setFormData] = useState({
    title: record?.title || '',
    description: record?.description || '',
    amount: record?.amount || '',
    type: record?.type || 'expense',
    category: record?.category || 'other',
    date: record?.date ? new Date(record.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const categories = {
    income: ['salary', 'business', 'investment', 'other'],
    expense: ['food', 'transport', 'utilities', 'entertainment', 'healthcare', 'education', 'shopping', 'other']
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (record) {
        await axios.put(`http://localhost:5000/api/records/${record._id}`, formData);
        toast.success('Record updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/records', formData);
        toast.success('Record created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="modal-header">
        <h2>{record ? 'Edit Record' : 'Add New Record'}</h2>
        <span className="modal-close" onClick={onClose}>&times;</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter title"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Enter description"
            rows="3"
          />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="Enter amount"
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories[formData.type].map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (record ? 'Update' : 'Create')}
          </button>
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecordForm;