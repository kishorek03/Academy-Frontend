// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { getUserFromToken } from './utils/tokenUtils';

import ResetPassword from './Service/ResetPassword';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Users/Profile';
import Announcements from './components/Users/Announcements';
import Settings from './components/Users/Settings';
import Payments from './components/Users/Payments';
import ShowPayments from './components/Admin/ShowPayments';
import ShowUsers from './components/Admin/ShowUsers';
import FixtureMaker from './components/Admin/FixtureMaker';
import AdminAnnouncements from './components/Admin/AdminAnnouncements';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      setIsAuthenticated(true);
      setRole(user.role);
    }
  }, []);

  return (
    <Router>
      <NavBar isAuthenticated={isAuthenticated} role={role} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} setRole={setRole} />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {isAuthenticated && (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
          </>
        )}

        {isAuthenticated && (role === 'PLAYER' || role === 'PARENT') && (
          <>
            <Route path="/profile" element={<Profile />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/announcements" element={<Announcements />} />
          </>
        )}

        {isAuthenticated && role === 'ADMIN' && (
          <>
            <Route path="/show-payments" element={<ShowPayments />} />
            <Route path="/show-users" element={<ShowUsers />} />
            <Route path="/fixture-maker" element={<FixtureMaker />} />
            <Route path="/admin-announcements" element={<AdminAnnouncements />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

const NavBar = ({ isAuthenticated, role }) => {
  return (
    <nav className="navbar">
      <ul className="nav-list">
        {!isAuthenticated ? (
          <>
            <li>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                Login
              </NavLink>
            </li>
            <li>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                Register
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                Home
              </NavLink>
            </li>

            {(role === 'PLAYER' || role === 'PARENT') && (
              <>
                <li>
                  <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/payments" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                    Payments
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/announcements" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                    Announcements
                  </NavLink>
                </li>
              </>
            )}

            {role === 'ADMIN' && (
              <>
                <li>
                  <NavLink to="/show-payments" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                    Payment Details
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/show-users" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                    Manage Users
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/fixture-maker" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                    Create Fixture
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin-announcements" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                    Announcement
                  </NavLink>
                </li>
              </>
            )}

            <li>
              <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                Settings
              </NavLink>
            </li>
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
