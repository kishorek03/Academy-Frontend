import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login({ setAuth }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const isTokenExpired = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp < Date.now() / 1000;
        } catch (error) {
            console.error('Error parsing token:', error);
            return true;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Email and password cannot be empty.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.token) {
                    localStorage.setItem('authToken', data.token);

                    if (!isTokenExpired(data.token)) {
                        setError('');
                        setAuth(true); // Update authentication status
                        navigate('/home'); // Redirect to home if the token is valid
                    } else {
                        setError('Session expired. Please log in again.');
                        localStorage.removeItem('authToken');
                    }
                } else {
                    setError('Login failed. No token received.');
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('An error occurred while logging in. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Login</h2>

                {error && <div className="error-message">{error}</div>}

                <div className="input-container">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="input-container">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="login-button">Sign In</button>

                <div className="login-footer">
                    <p>Don't have an account? <a href="/register">Sign up</a></p>
                </div>
            </form>
        </div>
    );
}

export default Login;
