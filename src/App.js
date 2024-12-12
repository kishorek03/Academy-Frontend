import React, { useState } from 'react';
import './App.css'; 
import { BrowserRouter as Router, Route, Routes, Link,  } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleSignOut = () => {
        localStorage.removeItem('authToken'); // Clear the stored token
        setIsAuthenticated(false); // Set authentication status to false
    };
    
    return (
        <Router>
            <div className="App">
                {/* Conditional Navigation Bar */}
                <nav>
                    <ul>
                        {isAuthenticated ? (
                            <>
                                <li>
                                    <button onClick={handleSignOut} className="nav-button">Sign Out</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/register" className="nav-button">Register</Link>
                                </li>
                                <li>
                                    <Link to="/login" className="nav-button">Login</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>

                {/* Routes Setup */}
                <Routes>
                    <Route 
                        path="/" 
                        element={<LandingPage />} 
                    />
                    <Route 
                        path="/register" 
                        element={<Register />} 
                    />
                    <Route 
                        path="/login" 
                        element={<Login setAuth={setIsAuthenticated} />} 
                    />
                     <Route 
                        path="/home" 
                        element={isAuthenticated ? <Home /> : <Login setAuth={setIsAuthenticated} />} 
                    />               
                </Routes>
            </div>
        </Router>
    );
}
const LandingPage = () => {
    return (
        <div className="landing-page">
            <header>
                <div className="hero-text">
                    <h1>TABLE TENNIS ACADEMY</h1>
                </div>
                <div className="hero-text">
                    <h2>Choose the right academy for your future .....</h2>
                </div>
            </header>
        </div>
    );
}
export default App;