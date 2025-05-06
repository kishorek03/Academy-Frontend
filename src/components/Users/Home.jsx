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
      localStorage.setItem("loggeduser", JSON.stringify(payload));
    } catch (error) {
      console.error("Invalid token format", error);
      navigate('/login');
    }
  }, [navigate]);

  if (!user) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.leftContent}>
        <h1 style={styles.heading}>Welcome, {user.name} </h1>
        <p style={styles.subHeading}>Ready to smash it today?</p>
        <p style={styles.subHeading}>Thanks for logging in. Let’s rally through a great experience!</p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '80vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: '5%',
    paddingRight: '8%',
  },
  leftContent: {
    color: 'white',
    maxWidth: '650px',
  },
  heading: {
    fontSize: '4rem',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  subHeading: {
    fontSize: '1.5rem',
    lineHeight: '2.2rem',
    marginBottom: '10px',
  },
  loading: {
    color: 'white',
    textAlign: 'center',
    marginTop: '50px',
    fontSize: '1.5rem',
  },
};

export default Home;
