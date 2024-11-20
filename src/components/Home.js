import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
    return (
        <div className="home-container">
            <h1>Welcome to the Home Page</h1>
            <p>You are successfully logged in!</p>
            <div className="home-footer">
                <Link to="/logout">Logout</Link>
            </div>
        </div>
    );
}

export default Home;
