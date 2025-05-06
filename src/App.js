// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { getUserFromToken } from './utils/tokenUtils';

import ResetPassword from './Service/ResetPassword';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Users/Home';
import Profile from './components/Users/Profile';
import Announcements from './components/Users/Announcements';
import Settings from './components/Users/Settings';
import Payments from './components/Users/Payments';
import AdminHome from './components/Admin/AdminHome';
import ShowPayments from './components/Admin/ShowPayments';
import ShowUsers from './components/Admin/ShowUsers';
import FixtureMaker from './components/Admin/FixtureMaker';
import AdminAnnouncements from './components/Admin/AdminAnnouncements';
import TTLogo from './styles/images/TTLogo.jpg';


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
            {role === 'PLAYER' || role === 'PARENT' ? (
              <>
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/settings" element={<Settings />} />
              </>
            ) : null}

            {role === 'ADMIN' && (
              <>
                <Route path="/home" element={<AdminHome />} />
                <Route path="/show-payments" element={<ShowPayments />} />
                <Route path="/show-users" element={<ShowUsers />} />
                <Route path="/fixture-maker" element={<FixtureMaker />} />
                <Route path="/admin-announcements" element={<AdminAnnouncements />} />
                <Route path="/settings" element={<Settings />} />
              </>
            )}
          </>
        )}
      </Routes>
    </Router>
  );
}

const NavBar = ({ isAuthenticated, role }) => {
  return (
    <nav className="navbar">
      <div className="logo-wrapper">
        <img src={TTLogo} alt="TT Logo" className="logo" />
        <span className="title1">TABLE TENNIS ACADEMY</span>
      </div>
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
            {(role === 'PLAYER' || role === 'PARENT') && (
              <>
                <li>
                  <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                    Home
                  </NavLink>
                </li>
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
                <li>
                  <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                    Settings
                  </NavLink>
                </li>
              </>
            )}

            {role === 'ADMIN' && (
              <>
                <li>
                  <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                    Home
                  </NavLink>
                </li>
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
                <li>
                  <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-button active' : 'nav-button'}>
                    Settings
                  </NavLink>
                </li>
              </>
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
};

export default App;
