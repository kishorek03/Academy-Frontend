import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [editableData, setEditableData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('No token found. Please login again.');
      navigate('/login');
      return;
    }

    // Load stored data from localStorage
    const storedBio = localStorage.getItem('bio');
    const storedDob = localStorage.getItem('dob');
    const storedAddress = localStorage.getItem('address');

    axios.get('http://localhost:8080/profile/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setUserData(res.data);
        setEditableData({
          ...res.data,
          bio: storedBio || res.data.bio,
          dob: storedDob || res.data.dob,
          address: storedAddress || res.data.address,
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
        setEditMode(false);

        // Store updated data in localStorage
        localStorage.setItem('bio', editableData.bio);
        localStorage.setItem('dob', editableData.dob);
        localStorage.setItem('address', editableData.address);
      })
      .catch((err) => {
        console.error('Update error:', err.response?.data || err.message);
      });
  };

  if (!userData) return <div style={styles.loading}>🏓 Loading your profile...</div>;

  const profileImage = userData.gender === 'Female'
    ? 'https://cdn-icons-png.flaticon.com/512/4140/4140051.png' // Girl image
    : 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png'; // Boy image

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Your Profile 🏓</h2>
        <div style={styles.profileContainer}>
          <div style={styles.leftSide}>
            <img src={profileImage} alt="User" style={styles.profileImage} />
            <div style={styles.username}>{userData.username}</div>
            <div style={styles.bio}>{editableData.bio}</div>
          </div>

          <div style={styles.rightSide}>
            {!editMode ? (
              <>
                <div style={styles.info}><strong>User Id:</strong> {userData.id}</div>
                <div style={styles.info}><strong>Email:</strong> {userData.email}</div>
                <div style={styles.info}><strong>Mobile:</strong> {userData.mobile}</div>
                <div style={styles.info}><strong>Gender:</strong> {userData.gender}</div>
                <div style={styles.info}><strong>User Type:</strong> {userData.userType}</div>
                <div style={styles.info}><strong>DOB:</strong> {editableData.dob}</div>
                <div style={styles.info}><strong>Address:</strong> {editableData.address}</div>

                <button style={styles.editButton} onClick={() => setEditMode(true)}>✏️ Edit Profile</button>
              </>
            ) : (
              <form onSubmit={handleUpdate}>
                {[ 
                  { label: 'DOB', name: 'dob', type: 'date' },
                  { label: 'Address', name: 'address' },
                  { label: 'Bio', name: 'bio' },
                ].map(({ label, name, type }) => (
                  <div style={styles.field} key={name}>
                    <label>{label}:</label>
                    <input
                      type={type || 'text'}
                      name={name}
                      value={editableData[name] || ''}
                      onChange={handleChange}
                    />
                  </div>
                ))}
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
                  <input type="text" name="userType" value={editableData.userType} readOnly />
                </div>

                <button style={styles.button} type="submit">✅ Save Changes</button>
                <button style={styles.cancelButton} onClick={() => setEditMode(false)}>❌ Cancel</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2.5rem',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '900px',
    fontFamily: '"Segoe UI", sans-serif',
    color: '#1f2937',
  },
  title: {
    fontSize: '26px',
    marginBottom: '.5rem',
    textAlign: 'center',
    color: '#1d4ed8',
  },
  profileContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  leftSide: {
    width: '35%',
    textAlign: 'center',
  },
  profileImage: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    marginBottom: '10px',
  },
  username: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  bio: {
    fontSize: '14px',
    color: '#6b7280',
  },
  rightSide: {
    width: '60%',
  },
  info: {
    fontSize: '16px',
    padding: '8px 0',
    borderBottom: '1px solid #e5e7eb',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
  },
  button: {
    backgroundColor: '#16a34a',
    color: '#ffffff',
    padding: '10px 18px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  cancelButton: {
    backgroundColor: '#dc2626',
    color: '#fff',
    padding: '10px 18px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  editButton: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    fontSize: '16px',
    marginTop: '20px',
    cursor: 'pointer',
  },
};

export default Profile;
