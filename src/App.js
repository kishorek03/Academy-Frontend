import React from 'react';
import './App.css'; // Make sure this line is present
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';

function App() {
    return (
        <Router>
            <div className="App">
                <nav>
                    <ul>
                        <li>
                            <Link to="/register" className="nav-button">Register</Link>
                        </li>
                        <li>
                            <Link to="/login" className="nav-button">Login</Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
