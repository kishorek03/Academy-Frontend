import React, { useState } from 'react';
import '../styles/Register.css';

function Register() {
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [registerFor, setRegisterFor] = useState('');
    const [children, setChildren] = useState([{ name: '', age: '', gender: '' }]);
    const [message, setMessage] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const handleAddChild = () => {
        setChildren([...children, { name: '', age: '', gender: '' }]);
    };

    const handleRemoveChild = (index) => {
        const newChildren = children.filter((_, i) => i !== index);
        setChildren(newChildren);
    };

    const handleSendOtp = async () => {
        if (!email) {
            setMessage('Please enter a valid email.');
            return;
        }
        setMessage('');
        try {
            const response = await fetch('http://localhost:8080/register/generate-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setMessage('OTP sent to your email.');
                setOtpSent(true);
            } else {
                const errorText = await response.text();
                setMessage(errorText || 'Failed to send OTP. Please try again.');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            setMessage('An error occurred while sending OTP.');
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            setMessage('Please enter the OTP.');
            return;
        }
        setMessage('');
        try {
            const response = await fetch('http://localhost:8080/register/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            if (response.ok) {
                setMessage('OTP verified successfully.');
                setIsVerified(true);
            } else {
                const errorText = await response.text();
                setMessage(errorText || 'OTP verification failed.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setMessage('An error occurred during OTP verification.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isVerified) {
            setMessage('Please verify your email with OTP before submitting.');
            return;
        }
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        const data = {
            username,
            gender,
            email,
            password,
            mobile,
            children: registerFor === "withChildren" ? children : []
        };

        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setMessage('Registration successful!');
                // Reset form fields
                setUsername('');
                setGender('');
                setEmail('');
                setOtp('');
                setPassword('');
                setConfirmPassword('');
                setMobile('');
                setRegisterFor('');
                setChildren([{ name: '', age: '', gender: '' }]);
                setOtpSent(false);
                setIsVerified(false);
            } else {
                setMessage('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2 className="register-title">Registration Form</h2>
                {message && <p className="message">{message}</p>}

                <div className="input-container otp-container">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className={`otp-button ${otpSent ? 'otp-sent' : ''}`}
                        onClick={handleSendOtp}
                        disabled={otpSent}
                    >
                        {otpSent ? 'OTP Sent...' : 'Send OTP'}
                    </button>
                </div>

                {otpSent && (
                    <div className="input-container otp-input verify-container">
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className={`verify-button ${isVerified ? 'verified' : ''}`} // Conditional class
                            onClick={handleVerifyOtp}
                            disabled={isVerified}
                        >
                            {isVerified ? 'OTP verified...' : 'Verify OTP'}
                        </button>

                    </div>
                )}

                {isVerified && (
                    <>
                        <div className="input-container">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-container">
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
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

                        <div className="input-container">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-container">
                            <input
                                type="text"
                                placeholder="Mobile Number"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-container">
                            <select
                                value={registerFor}
                                onChange={(e) => setRegisterFor(e.target.value)}
                                required
                            >
                                <option value="">Select Registration Type</option>
                                <option value="self">Registering for yourself</option>ā
                                <option value="withChildren">Registering with children</option>
                            </select>
                        </div>


                        {registerFor === "withChildren" && (
                            <div className="add-children-section">
                                <h3>Children Details</h3>
                                {children.map((child, index) => (
                                    <div key={index} className="input-container child-container">
                                        <input
                                            type="text"
                                            placeholder="Child Name"
                                            value={child.name}
                                            onChange={(e) => {
                                                const newChildren = [...children];
                                                newChildren[index].name = e.target.value;
                                                setChildren(newChildren);
                                            }}
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Child Age"
                                            value={child.age}
                                            onChange={(e) => {
                                                const newChildren = [...children];
                                                newChildren[index].age = e.target.value;
                                                setChildren(newChildren);
                                            }}
                                            required
                                        />
                                        <select
                                            value={child.gender}
                                            onChange={(e) => {
                                                const newChildren = [...children];
                                                newChildren[index].gender = e.target.value;
                                                setChildren(newChildren);
                                            }}
                                            required
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                        <button type="button" onClick={() => handleRemoveChild(index)} className="remove-child">
                                            Remove Child
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddChild} className="add-child">
                                    Add Child
                                </button>
                            </div>
                        )}
                    </>

                )}
                <button type="submit" className="register-button">
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;
