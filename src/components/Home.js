import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // Store user information
    const [loading, setLoading] = useState(true); // Loading state while fetching user details
    const [countdown, setCountdown] = useState(0); // Track token expiration countdown
    const [dropdownVisible, setDropdownVisible] = useState(false); // Toggle dropdown visibility

    // Fetch user details from the token
    const fetchUserDetails = async (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
            setUser({
                name: payload.sub,   // Assuming 'sub' is the username
                email: payload.email  // Assuming 'email' is in the token
            });
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching data
        }
    };

    // Start countdown timer based on token expiration
    const startCountdown = useCallback((token) => {
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
    }, [navigate]);

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
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="home-container">
            <h1>Welcome, {user ? user.name : 'User'}!</h1>
            <h2>It's great to have you back.</h2>

            {/* Profile Dropdown and Countdown Timer at the top-right */}
            <div className="profile-countdown-container">
                {user && (
                    <div className="profile-dropdown">
                        <button onClick={toggleDropdown} className="profile-btn">
                            <img src="user-icon.png" alt="User" className="profile-icon" />
                        </button>
                        {dropdownVisible && (
                            <div className="dropdown-menu">
                                <p className="dropdown-title">Hi, {user.name}</p>
                                <hr />
                                <button className="dropdown-item">Edit Profile</button>
                                <button className="dropdown-item">Upload Picture</button>
                                <button className="dropdown-item">View Announcements</button>
                                <button className="dropdown-item" onClick={handleLogout}>Log Out</button>
                            </div>
                        )}
                    </div>
                )}

                <div className="countdown-timer">
                    {countdown > 0 ? (
                        <p>Session expires in {countdown} seconds.</p>
                    ) : (
                        <p>Your session has expired. Redirecting...</p>
                    )}
                </div>
            </div>

            <div className="home-footer">
                {/* Footer content */}
            </div>
        </div>
    );
}

export default Home;