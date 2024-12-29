import React, { useState } from 'react';
import './App.css'; 
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import ResetPassword from './Service/ResetPassword';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <Navigation isAuthenticated={isAuthenticated} />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
                <Route 
                    path="/home" 
                    element={isAuthenticated ? <Home /> : <Login setAuth={setIsAuthenticated} />} 
                />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
        </Router>
    );
}

const Navigation = ({ isAuthenticated }) => {
    const location = useLocation(); // Correctly used inside Router context
    const isLoginPage = location.pathname === '/login';
    const isRegisterPage = location.pathname === '/register';

    return (
        <nav>
            <ul>
                {!isAuthenticated && (
                    <>
                        {/* Hide Login button if on login page */}
                        {!isLoginPage && (
                            <li>
                                <Link to="/login" className="nav-button">Login</Link>
                            </li>
                        )}
                        {/* Hide Register button if on register page */}
                        {!isRegisterPage && (
                            <li>
                                <Link to="/register" className="nav-button">Register</Link>
                            </li>
                        )}
                    </>
                )}
            </ul>
        </nav>
    );
};

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
