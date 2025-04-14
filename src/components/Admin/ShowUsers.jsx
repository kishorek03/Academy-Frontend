import React, { useEffect, useState ,useCallback } from 'react';
import axios from 'axios';

const ShowUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('authToken');


  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);


  const toggleActive = async (userId, currentStatus) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/admin/users/${userId}/status`,
        { active: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating status:', error.message);
      alert('Failed to update user status');
    }
  };

  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:8080/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          fetchUsers();
        }
      } catch (error) {
        console.error('Error deleting user:', error.message);
        alert('Failed to delete user');
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchBar}
      />

      {loading ? (
        <div style={styles.loading}>Loading users...</div>
      ) : (
        <div style={styles.scrollContainer}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} style={styles.userCard}>
                <div style={styles.userContent}>
                  <div style={styles.userInfo}>
                    <div style={styles.row}><strong>ID:</strong> {user.id}</div>
                    <div style={styles.row}><strong>Username:</strong> {user.username}</div>
                    <div style={styles.row}><strong>Gender:</strong> {user.gender}</div>
                    <div style={styles.row}><strong>Mobile:</strong> {user.mobile}</div>
                    <div style={styles.row}><strong>Role:</strong> {user.userType}</div>
                    <div style={styles.row}>
                      <strong>Status:</strong>{' '}
                      <button
                        onClick={() => toggleActive(user.id, user.active)}
                        style={{
                          ...styles.statusButton,
                          backgroundColor: user.active ? '#22c55e' : '#ef4444',
                        }}
                      >
                        {user.active ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                    <div style={styles.row}>
                      <button
                        onClick={() => deleteUser(user.id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                    {user.children && user.children.length > 0 && (
                      <div style={styles.row}>
                        <strong>Children:</strong>
                        <ul style={{ marginTop: '6px', paddingLeft: '20px' }}>
                          {user.children.map((child) => (
                            <li key={child.id}>
                              {child.name} - Age: {child.age}, Gender: {child.gender}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div style={styles.userAvatar}>
                    <img
                     src={
                      user.gender === 'Female'
                        ? 'https://cdn-icons-png.flaticon.com/512/4140/4140051.png' // 👧 Girl image
                        : 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png' // 👦 Boy image
                    }
                      alt="user avatar"
                      style={styles.avatarImg}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.noData}>No users found.</div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '80px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  searchBar: {
    width: '90%',
    maxWidth: '650px',
    padding: '12px 16px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '1rem',
    outline: 'none',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  scrollContainer: {
    width: '100%',
    maxWidth: '900px',
    maxHeight: '550px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  userCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  userContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfo: {
    flex: 1,
  },
  row: {
    marginBottom: '10px',
    fontSize: '16px',
    color: '#334155',
  },
  statusButton: {
    border: 'none',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    border: 'none',
  },
  userAvatar: {
    marginLeft: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  loading: {
    fontSize: '18px',
    color: '#475569',
    marginTop: '40px',
  },
  noData: {
    textAlign: 'center',
    padding: '20px',
    color: '#64748b',
    fontStyle: 'italic',
  },
};

export default ShowUsers;
