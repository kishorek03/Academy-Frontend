import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // Store user information
    const [countdown, setCountdown] = useState(0); // Track token expiration countdown
    const [dropdownVisible, setDropdownVisible] = useState(false); // Toggle dropdown visibility

    // Fetch user details from the token (only username)
    const fetchUserDetails = async (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
            setUser({
                name: payload.sub, // Assuming 'sub' is the username
            });
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    // Start countdown timer based on token expiration
    const startCountdown = useCallback(
        (token) => {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expirationTime = payload.exp * 1000; // exp is in seconds, convert to milliseconds
                const currentTime = Date.now();
                const remainingTime = expirationTime - currentTime;

                if (remainingTime > 0) {
                    const interval = setInterval(() => {
                        const newRemainingTime = expirationTime - Date.now();
                        setCountdown(Math.floor(newRemainingTime / 1000)); // Update countdown every second

                        if (newRemainingTime <= 0) {
                            clearInterval(interval); // Stop countdown when token expires
                            navigate('/login'); // Redirect to login
                        }
                    }, 1000);
                }
            } catch (error) {
                console.error('Error calculating countdown:', error);
            }
        },
        [navigate]
    );

    // Check if token is expired
    const isTokenExpired = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp < Date.now() / 1000; // Expiration check
        } catch (error) {
            console.error('Error parsing token:', error);
            return true; // Assume expired if error occurs
        }
    };

    // Handle user authentication on page load
    useEffect(() => {
        const token = localStorage.getItem('authToken');

        if (!token || isTokenExpired(token)) {
            navigate('/login'); // Redirect to login if not authenticated or token expired
        } else {
            fetchUserDetails(token); // Fetch user details if valid token
            startCountdown(token); // Start countdown for token expiration
        }
    }, [navigate, startCountdown]);

    // Handle toggling the dropdown menu
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Remove token on logout
        navigate('/login'); // Redirect to login page
    };

    // Show loading message until user data is fetched
    if (!user) {
        return <div>Loading...</div>;
    }

    // Inline styles for responsive design
    const styles = {
        homeContainer: {
            textAlign: 'center',
            padding: '40px',
            position: 'relative',
        },
        header: {
            fontSize: '36px',
            color: '#1de5f7',
        },
        footer: {
            marginTop: '20px',
        },
        footerLink: {
            fontSize: '16px',
            color: '#1de5f7',
            textDecoration: 'none',
        },
        footerLinkHover: {
            textDecoration: 'underline',
        },
        profileButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
        },
        profileIcon: {
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            borderRadius: '50%',
        },
        dropdownToggle: {
            color: 'linear-gradient(90deg, #ff7a00, #ff2a68)',
            fontSize: '25px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px',
        },
        profileDropdown: {
            position: 'absolute',
            right: '20px',
            top: '20px',
            display: 'inline-block',
        },
        dropdownMenu: {
            position: 'absolute',
            right: 0,
            top: '100%',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            minWidth: '150px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        },
        dropdownItem: {
            background: 'none',
            border: 'none',
            color: '#007bff',
            padding: '8px',
            cursor: 'pointer',
            textAlign: 'left',
        },
        dropdownItemHover: {
            backgroundColor: '#f1f1f1',
        },
        logoutButton: {
            background: 'linear-gradient(90deg, #ff7a00, #ff2a68)',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '10px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'background 0.3s ease',
        },
        logoutButtonHover: {
            background: 'linear-gradient(90deg, #ff2a68, #ff7a00)',
        },
    };

    return (
        <div style={styles.homeContainer}>
            <h1 style={styles.header}>Welcome, {user.name}!</h1>
            <h2>It's great to have you back.</h2>

            {/* Profile Dropdown and Countdown Timer at the top-right */}
            <div style={styles.profileDropdown}>
                {/* User icon */}
                <button onClick={toggleDropdown} style={styles.profileButton}>
                    <img src="K:\java\academy-frontend\src\styles\images\profile.png" style={styles.profileIcon} />
                </button>

                {/* Display user's name and handle dropdown visibility */}
                <p className="gradient-text" onClick={toggleDropdown} style={styles.dropdownToggle}>{`Hi, ${user.name}`}</p>

                {dropdownVisible && (
                    <div style={styles.dropdownMenu}>
                        <p>Session expires in </p>
                        <p>{countdown > 0 ? countdown : 'Expired'} seconds</p>
                        <hr />
                        <button
                            style={styles.logoutButton}
                            onClick={handleLogout}
                            onMouseEnter={(e) =>
                                (e.target.style.background =
                                    styles.logoutButtonHover.background)
                            }
                            onMouseLeave={(e) =>
                                (e.target.style.background =
                                    styles.logoutButton.background)
                            }
                        >
                            Log Out
                        </button>
                    </div>
                )}
            </div>

            <div style={styles.footer}>
                {/* Footer content */}
            </div>
        </div>
    );
}

export default Home;
