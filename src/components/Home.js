import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null); // State to store user information
    const [loading, setLoading] = useState(true); // Loading state while fetching user details
    const [countdown, setCountdown] = useState(0); // State to track the countdown for token expiration

    // Function to fetch user details from the token
    const fetchUserDetails = async (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
            setUser({
                name: payload.sub,   // Assuming 'sub' contains the username
                email: payload.email  // Assuming the 'email' is in the token as well
            });
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false); // Set loading to false once data is fetched
        }
    };

    // Start countdown timer based on the token expiration time
    const startCountdown = useCallback((token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
            const expirationTime = payload.exp * 1000; // exp is in seconds, convert to milliseconds
            const currentTime = Date.now();
            const remainingTime = expirationTime - currentTime; // Calculate remaining time in milliseconds

            if (remainingTime > 0) {
                const interval = setInterval(() => {
                    const newRemainingTime = expirationTime - Date.now();
                    setCountdown(Math.floor(newRemainingTime / 1000)); // Update countdown in seconds

                    if (newRemainingTime <= 0) {
                        clearInterval(interval); // Stop countdown when token expires
                        navigate('/login'); // Redirect to login after token expires
                    }
                }, 1000); // Update every second
            }
        } catch (error) {
            console.error('Error calculating countdown:', error);
        }
    }, [navigate]);

    // Check if the user is authenticated by checking the token
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        
        if (!token || isTokenExpired(token)) {
            navigate('/login'); // Redirect to login if not authenticated
        } else {
            fetchUserDetails(token); // Fetch user details if token is valid
            startCountdown(token); // Start the countdown for token expiration
        }
    }, [navigate, startCountdown]);

    const isTokenExpired = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp < Date.now() / 1000; // Compare expiration time to current time
        } catch (error) {
            console.error('Error parsing token:', error);
            return true; // Assume expired if error occurs
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Show a loading message while fetching data
    }

    return (
        <div className="home-container">
            <h1>Welcome, {user ? user.name : 'User'}!</h1>
            <h2>It's great to have you back.</h2>

            {/* Countdown Timer */}
            <div className="countdown-timer">
                {countdown > 0 ? (
                    <p>Session expires in {countdown} seconds.</p>
                    
                ) : (
                    <p>Your session has expired. Redirecting...</p>
                )}
            </div>

            <div className="home-footer">
                {/* Additional content, e.g., logout button */}
            </div>
        </div>
    );
}

export default Home;
