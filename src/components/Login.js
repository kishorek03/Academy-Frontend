import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for redirection
import '../styles/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');  // State to hold error messages
    const navigate = useNavigate();  // Initialize useNavigate hook

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate email and password input
        if (!email || !password) {
            setError("Email and password cannot be empty.");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            // Handle response based on status code
            if (response.ok) {
                // Successful login, navigate to Home
                setError('');  // Clear any previous error
                navigate('/home');  // Redirect to Home page (or dashboard)
            } else {
                // Handle server error response (like invalid email or password)
                const errorData = await response.json();

                if (errorData.message) {
                    // If backend returns a message, display it
                    setError(errorData.message);
                } else {
                    // If there's no specific error message, use a default one
                    setError('Login failed. Please check your credentials.');
                }
            }
        } catch (error) {
            // Catch any other errors like network issues
            console.error('Error during login:', error);
            setError('An error occurred while logging in. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Login</h2>

                {/* Error message */}
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
