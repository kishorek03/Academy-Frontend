import React, { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function AdminAnnouncements() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [editData, setEditData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const token = localStorage.getItem('authToken');


  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/admin/announcements', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setAnnouncements(data);
    } catch (err) {
      console.error('Error:', err.message);
    }
  }, [token]);
  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);


  useEffect(() => {
    if (editData) {
      setTitle(editData.title || '');
      setContent(editData.content || '');
    }
  }, [editData]);

  const handleSubmit = async () => {
    const announcement = { title, content };

    const url = editData
      ? `http://localhost:8080/admin/announcement/${editData.id}`
      : 'http://localhost:8080/admin/postAnnouncement';

    const method = editData ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(announcement),
      });

      if (response.ok) {
        alert(editData ? 'Announcement updated!' : 'Announcement created!');
        setTitle('');
        setContent('');
        setEditData(null);
        fetchAnnouncements();
      } else {
        alert('Failed to save announcement.');
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this announcement?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/admin/announcement/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Announcement deleted!');
        fetchAnnouncements();
      } else {
        alert('Failed to delete.');
      }
    } catch (err) {
      console.error('Error:', err.message);
    }
  };

  return (
    <div className="admin-page">
      <div className="left-panel">
        <h1>{editData ? 'Edit Announcement' : 'Create Announcement'}</h1>
        <input
          type="text"
          className="title-input"
          placeholder="Enter title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          placeholder="Write your message..."
          modules={AdminAnnouncements.modules}
          formats={AdminAnnouncements.formats}
        />
        <button className="submit-btn" onClick={handleSubmit}>
          {editData ? 'Update' : 'Post'}
        </button>
      </div>

      <div className="right-panel">
        <h1>Existing Announcements</h1>
        <div className="announcement-scroll">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Title</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((a, index) => (
                <tr key={a.id}>
                  <td>{index + 1}</td>
                  <td>{a.title}</td>
                  <td>{new Date(a.createdAt).toLocaleString()}</td>
                  <td>
                    <button className="action-btn" onClick={() => setEditData(a)}>Edit</button>
                    <button className="action-btn" onClick={() => handleDelete(a.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {announcements.length === 0 && (
                <tr>
                  <td colSpan="4">No announcements found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .admin-page {
          display: flex;
          gap: 30px 20px;
          padding: 100px 20px;
          min-height: 80vh;
        }

        .left-panel, .right-panel {
          flex: 1;
          background-color: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .left-panel h2 {
          margin-bottom: 50px;
          color: #ff6347;
        }

        .right-panel h3 {
          color: #333;
          margin-bottom: 50px;
        }

        .title-input {
          width: 80%;
          padding: 12px;
          font-size: 16px;
          margin-bottom: 20px;
          border-radius: 8px;
          border: 1px solid #ccc;
          background-color: #f9f9f9;
        }

        .submit-btn {
          margin-top: 20px;
          padding: 12px 29px;
          background-color: #ff6347;
          color: white;
          font-size: 18px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .submit-btn:hover {
          background-color: #ff4500;
        }

        .announcement-scroll {
          max-height: 500px;
          overflow-y: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }

        th {
          background-color: #f5f5f5;
        }

        .action-btn {
          margin-right: 8px;
          padding: 6px 14px;
          background-color: #ff6347;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .action-btn:hover {
          background-color: #ff4500;
        }
      `}</style>
    </div>
  );
}

AdminAnnouncements.modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'size': [] }, { 'color': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link'],
    ['clean'],
  ],
};

AdminAnnouncements.formats = [
  'header', 'bold', 'italic', 'underline', 'size', 'color', 'list', 'bullet', 'link',
];

export default AdminAnnouncements;
