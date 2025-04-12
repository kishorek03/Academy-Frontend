import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [editableData, setEditableData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log(token)
    if (!token) {
      alert('No token found. Please login again.');
      navigate('/login');
      return;
    }

    axios.get('http://localhost:8080/profile/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setUserData(res.data);
        setEditableData({
          username: res.data.username || '',
          email: res.data.email || '',
          mobile: res.data.mobile || '',
          gender: res.data.gender || '',
          userType: res.data.userType || '',
        });
      })
      .catch((err) => {
        console.error('Error fetching profile:', err.response?.data || err.message);
        alert('Error fetching profile. Please login again.');
      });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    axios.put('http://localhost:8080/profile/update', editableData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        alert('Profile updated successfully!');
        setUserData(res.data);
      })
      .catch((err) => {
        console.error('Update error:', err.response?.data || err.message);
        alert('Failed to update profile');
      });
  };

  if (!userData) return <div style={styles.loading}>🏓 Loading your profile...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🏓 Table Tennis Profile</h2>
        <form onSubmit={handleUpdate}>
          <div style={styles.field}>
            <label>Username:</label>
            <input type="text" name="username" value={editableData.username} onChange={handleChange} />
          </div>

          <div style={styles.field}>
            <label>Email:</label>
            <input type="email" name="email" value={editableData.email} onChange={handleChange} />
          </div>

          <div style={styles.field}>
            <label>Mobile:</label>
            <input type="text" name="mobile" value={editableData.mobile} onChange={handleChange} />
          </div>

          <div style={styles.field}>
            <label>Gender:</label>
            <select name="gender" value={editableData.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={styles.field}>
            <label>User Type:</label>
            <input type="text" name="userType" value={editableData.userType} onChange={handleChange} disabled />
          </div>

          <button style={styles.button} type="submit">🎯 Update Profile</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(to right, #e0f2fe, #38bdf8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '2.5rem 3rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: '500px',
    fontFamily: '"Segoe UI", sans-serif',
    color: '#0f172a',
  },
  title: {
    fontSize: '28px',
    marginBottom: '1.5rem',
    color: '#1e3a8a',
    textAlign: 'center',
    borderBottom: '2px dashed #3b82f6',
    paddingBottom: '0.5rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
  },
  button: {
    backgroundColor: '#0284c7',
    color: '#ffffff',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '1rem',
    transition: 'background 0.3s ease',
  },
  loading: {
    textAlign: 'center',
    marginTop: '150px',
    fontSize: '20px',
    color: '#334155',
    fontFamily: '"Segoe UI", sans-serif',
  },
};

export default Profile;
