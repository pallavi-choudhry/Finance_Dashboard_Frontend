import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import UserForm from './UserForm';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/roles');
      setRoles(response.data.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await axios.put(`http://localhost:5000/api/users/${id}/status`, { status: newStatus });
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const getRoleName = (roleId) => {
    const role = roles.find(r => r._id === roleId);
    return role ? role.name : 'Unknown';
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>User Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add User
        </button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`user-role role-${getRoleName(user.role)}`}>
                    {getRoleName(user.role)?.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    backgroundColor: user.status === 'active' ? '#d4edda' : '#f8d7da',
                    color: user.status === 'active' ? '#155724' : '#721c24'
                  }}>
                    {user.status}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setEditingUser(user);
                      setShowModal(true);
                    }}
                    style={{ marginRight: '10px' }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn"
                    onClick={() => handleStatusChange(user._id, user.status)}
                    style={{
                      marginRight: '10px',
                      backgroundColor: user.status === 'active' ? '#ffc107' : '#28a745',
                      color: 'white'
                    }}
                  >
                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <UserForm
              user={editingUser}
              roles={roles}
              onClose={() => {
                setShowModal(false);
                setEditingUser(null);
                fetchUsers();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;