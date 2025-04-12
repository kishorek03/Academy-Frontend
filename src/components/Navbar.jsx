import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <>
      <nav style={styles.navbarContainer}>
        <div style={styles.navbarTitle}>
          <img 
          src="../styles/images/TTLogo.jpg" height="200" width="200" style={styles.navbarLogo} 
          />
          <span style={styles.academyTitle}>TABLE TENNIS ACADEMY</span>
        </div>
        <ul style={styles.navLinks}>
          <li><Link to="/profile" style={styles.navButton}>Profile</Link></li>
          <li><Link to="/announcements" style={styles.navButton}>Announcements</Link></li>
          <li><Link to="/payments" style={styles.navButton}>Payments</Link></li>
          <li><Link to="/settings" style={styles.navButton}>Settings</Link></li>
        </ul>
      </nav>
    </>
  );
};
const styles = {
  navbarContainer: {
    position: 'fixed', // Keep the navbar fixed at the top
    top: 0,            // Align it to the top of the page
    left: 0,           // Align it to the left of the page
    width: '100%',     // Make sure the navbar spans the full width
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    zIndex: 1000,      // Make sure it appears above other content (like background)
  },
  navbarTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  navbarLogo: {
    width: '40px',
    height: 'auto',
    marginRight: '10px',
  },
  academyTitle: {
    fontSize: '1.5rem',
    color: 'white',
    fontWeight: 'bold',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
  },
  navLinksItem: {
    marginLeft: '20px',
  },
  navButton: {
    textDecoration:'none',
    color: 'white',
    fontSize: '1rem',
  },
  navButtonHover: {
    color: '#00f0ff', // Hover effect
  }
};
