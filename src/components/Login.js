import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

function Login({ setAuth }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [mode, setMode] = useState('login');
    const [loading, setLoading] = useState(false); // New state for managing loading
    const navigate = useNavigate();

    const handleSubmitLogin = async (e) => {
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
                    setError('');
                    setAuth(true);
                    navigate('/home');
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

    const handleForgotPassword = async (e) => {
        e.preventDefault();
    
        if (!email) {
            setMessage('Please enter a valid email.');
            setError('');
            return;
        }
    
        setMessage('Sending email...');
        setError('');
        setLoading(true); // Set loading to true when the request starts
    
        try {
            const response = await fetch(`http://localhost:8080/login/forgot-password?email=${encodeURIComponent(email)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.ok) {
                setMessage('Email with reset instructions sent successfully.');
                setError('');
            } else {
                const errorMessage = await response.text();
                setMessage('');
                setError(errorMessage || 'Failed to send reset link. Please try again.');
            }
        } catch (error) {
            console.error('Error during forgot password:', error);
            setMessage('');
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false); // Set loading to false after the request completes
        }
    };

    return (
        <div className="login-container">
            {mode === 'login' && (
                <form className="login-form" onSubmit={handleSubmitLogin}>
                    <h2 className="login-title">Login</h2>

                    {error && <div className="error-message">{error}</div>}
                    {message && <div className="success-message">{message}</div>}

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
                        <p onClick={() => setMode('forgot-password')} className="login-footer1">Forgot Password?</p>
                        <p>Don't have an account? <a href="/register">Sign up</a></p>
                    </div>
                </form>
            )}

            {mode === 'forgot-password' && (
                <form className="login-form" onSubmit={handleForgotPassword}>
                    <h2 className="login-title">Forgot Password</h2>

                    {error && <div className="error-message">{error}</div>}
                    {message && <div className="success-message">{message}</div>}

                    <div className="input-container">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="login-button" 
                        disabled={loading} // Disable button if loading is true
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>

                    <div className="login-footer1">
                        <p onClick={() => setMode('login')} className="back-to-login-link">Back to Login</p>
                    </div>
                </form>
            )}
        </div>
    );
}

export default Login;
