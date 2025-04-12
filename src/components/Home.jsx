import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({
        name: payload?.sub,
        id: payload.userId,
      });
      localStorage.setItem("loggeduser",JSON.stringify(payload));
    } catch (error) {
      console.error("Invalid token format", error);
      navigate('/login');
    }
  }, [navigate]);


  if (!user) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.heading}>Welcome, {user.name} 🏓</h1>
        <p style={styles.subHeading}>Ready to smash it today?</p>
        <p style={styles.subHeading}>Thanks for logging in. Let’s rally through a great experience!</p>
      </div>
    </div>
  );
}

export default Home;

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px'
  },
  content: {
    textAlign: 'center',
    backgroundColor: 'rgba(220, 196, 196, 0)',
    padding: '50px 40px',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 255, 255, 0.05)',
    color: 'white'
  },
  heading: {
    fontSize: '2.8rem',
    marginBottom: '1rem',
    color: '#00f0ff'
  },
  subHeading: {
    fontSize: '1.2rem',
    color: '#ffffffc0',
    marginTop: '1rem'
  }
};
