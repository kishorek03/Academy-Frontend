import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
    const navigate = useNavigate();

    // Check if the user is authenticated by checking the token
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        
        if (!token || isTokenExpired(token)) {
            navigate('/login'); // Redirect to login if not authenticated
        }
    }, [navigate]);

    const isTokenExpired = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp < Date.now() / 1000;
        } catch (error) {
            console.error('Error parsing token:', error);
            return true;
        }
    };

    return (
        <div className="home-container">
            <h1>Welcome to the Home Page</h1>
            <p>You are successfully logged in!</p>
            <div className="home-footer">
            </div>
        </div>
    );
}

export default Home;
