import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const UserForm = ({ user, roles, onClose }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role?._id || (roles[0]?._id || ''),
    status: user?.status || 'active'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user && !formData.password) {
      toast.error('Password is required for new users');
      return;
    }
    
    if (formData.password && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      if (user) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status
        };
        await axios.put(`http://localhost:5000/api/users/${user._id}`, updateData);
        
        if (formData.password) {
          await axios.put(`http://localhost:5000/api/users/${user._id}/password`, {
            password: formData.password
          });
        }
        
        toast.success('User updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/users', formData);
        toast.success('User created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="modal-header">
        <h2>{user ? 'Edit User' : 'Add New User'}</h2>
        <span className="modal-close" onClick={onClose}>&times;</span>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label>Password {user && '(Leave blank to keep current)'}</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={user ? 'Enter new password' : 'Enter password'}
            required={!user}
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            {roles.map(role => (
              <option key={role._id} value={role._id}>
                {role.name.toUpperCase()} - {role.description}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (user ? 'Update' : 'Create')}
          </button>
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;