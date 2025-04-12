import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation, Link } from 'react-router-dom';

import ResetPassword from './Service/ResetPassword';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import Announcements from './components/Announcements';
import Settings from './components/Settings';
import Payments from './components/Payments';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <NavBar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Login setAuth={setIsAuthenticated} />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Login setAuth={setIsAuthenticated} />}
        />
        <Route
          path="/payments"
          element={isAuthenticated ? <Payments /> : <Login setAuth={setIsAuthenticated} />}
        />
        <Route
          path="/announcements"
          element={isAuthenticated ? <Announcements /> : <Login setAuth={setIsAuthenticated} />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <Settings /> : <Login setAuth={setIsAuthenticated} />}
        />
      </Routes>
    </Router>
  );
}

const NavBar = ({ isAuthenticated }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  return (
    <nav className="navbar">
      <ul className="nav-list">
        {!isAuthenticated ? (
          <>
            {!isLoginPage && (
              <li>
                <Link to="/login" className="nav-button">Login</Link>
              </li>
            )}
            {!isRegisterPage && (
              <li>
                <Link to="/register" className="nav-button">Register</Link>
              </li>
            )}
          </>
        ) : (
          <>
            <li><Link to="/home" className="nav-button">Home</Link></li>
            <li><Link to="/profile" className="nav-button">Profile</Link></li>
            <li><Link to="/payments" className="nav-button">Payments</Link></li>
            <li><Link to="/announcements" className="nav-button">Announcements</Link></li>
            <li><Link to="/settings" className="nav-button">Settings</Link></li>
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
};

export default App;
