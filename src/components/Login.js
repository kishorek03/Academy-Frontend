import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/Login.css';

function Login({ setAuth }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [mode, setMode] = useState('login');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });

    };

    const handleSubmitLogin = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            setError('Email and password cannot be empty.');
            setMessage('');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });


            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem('authToken', data.token);
                setAuth(true);
                const decoded = jwtDecode(data.token);
                setRole(decoded.role);
                console.log(role)
                setError('');
                setMessage('');
                navigate('/home');
            } else {
                setError(data.message || 'Login failed. Please check your credentials.');
                setMessage('');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred while logging in. Please try again.');
            setMessage('');
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!form.email) {
            setError('');
            setMessage('Please enter a valid email.');
            return;
        }

        setLoading(true);
        setError('');
        setMessage('Sending email...');

        try {
            const response = await fetch(
                `http://localhost:8080/login/forgot-password?email=${encodeURIComponent(form.email)}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            if (response.ok) {
                setMessage('Email with reset instructions sent successfully.');
                setError('');
            } else {
                const msg = await response.text();
                setError(msg || 'Failed to send reset link. Please try again.');
                setMessage('');
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            setError('An error occurred. Please try again.');
            setMessage('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form
                className="login-form"
                onSubmit={mode === 'login' ? handleSubmitLogin : handleForgotPassword}
            >
                <h2 className="login-title">
                    {mode === 'login' ? 'Login' : 'Forgot Password'}
                </h2>

                {error && <div className="error-message">{error}</div>}
                {message && <div className="success-message">{message}</div>}

                <div className="input-container">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {mode === 'login' && (
                    <div className="input-container">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="login-button"
                    disabled={mode === 'forgot-password' && loading}
                >
                    {mode === 'forgot-password' ? (loading ? 'Sending...' : 'Send Reset Link') : 'Sign In'}
                </button>

                <div className="login-footer">
                    {mode === 'login' ? (
                        <>
                            <p
                                className="login-footer1"
                                onClick={() => {
                                    setMode('forgot-password');
                                    setMessage('');
                                    setError('');
                                }}
                            >
                                Forgot Password?
                            </p>
                            <p>
                                Don't have an account? <a href="/register">Sign up</a>
                            </p>
                        </>
                    ) : (
                        <p
                            className="back-to-login-link"
                            onClick={() => {
                                setMode('login');
                                setMessage('');
                                setError('');
                            }}
                        >
                            Back to Login
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}

export default Login;
