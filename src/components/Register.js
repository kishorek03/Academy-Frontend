import React, { useState} from 'react';
import '../styles/Register.css';

function Register() {
    const [username, setUsername] = useState('');
    const [userType, setUserType] = useState(''); // initialize as empty string
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
        // Check if email is provided
        if (!email) {
            setMessage('Please enter a valid email.');
            return;
        }
    
        // Set loading state and message while OTP is being processed
        setMessage('Sending OTP...');
        setOtpSent(false); // Ensure OTP has not been sent until checked and verified
    
        try {
            // Check if the email already exists
            const checkEmailResponse = await fetch('http://localhost:8080/register/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
    
            // If the email is already registered, show an appropriate message
            if (!checkEmailResponse.ok) {
                const errorText = await checkEmailResponse.text();
                setMessage(errorText || 'Email is already registered.');
                setOtpSent(false);
                return;
            }
    
            // If the email is valid and not already registered, send OTP
            const response = await fetch('http://localhost:8080/register/generate-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
    
            // Handle OTP response
            if (response.ok) {
                setMessage('OTP sent to your email.');
                setOtpSent(true); // OTP successfully sent, allow user to proceed
            } else {
                const errorText = await response.text();
                setMessage(errorText || 'Failed to send OTP.');
                setOtpSent(false);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            setMessage('An error occurred while sending OTP.');
            setOtpSent(false);
        }
    };
    
    const handleRegisterForChange = (e) => {
        const selection = e.target.value;
        setRegisterFor(selection);

        // Set userType based on selection
        if (selection === "self") {
            setUserType("PLAYER");
            setChildren([]); // clear children if registering for self
        } else if ((selection === "withChildren"|| selection === "childrenOnly")) {
            setUserType("PARENT");
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

        // Email verification check
        if (!isVerified) {
            setMessage('Please verify your email with OTP before submitting.');
            return;
        }

        // Password confirmation check
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        const registrationData = {
            username,
            gender,
            email,
            password,
            mobile,
            userType,
            children: (registerFor === "withChildren" || registerFor === "onlyForChildren") ? children : []
        };

        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData),
            });

            if (response.ok) {
                setMessage('Registration successful!');
                setUsername('');
                setGender('');
                setEmail('');
                setOtp('');
                setPassword('');
                setConfirmPassword('');
                setMobile('');
                setRegisterFor('');
                setChildren([]);
                setOtpSent(false);
                setIsVerified(false);
            } else {
                const errorData = await response.json();
                if (errorData && typeof errorData === 'object') {
                    const errorMessages = Object.values(errorData).join(', ');
                    setMessage(`Registration failed: ${errorMessages}`);
                } else {
                    setMessage('Registration failed. Please verify the details.');
                }
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setMessage('An error occurred while communicating with the server.');
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
                                <option value="Others">others</option>

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
                                onChange={handleRegisterForChange}
                                required
                            >
                                <option value="">Select Registration Type</option>
                                <option value="self">Registering for yourself</option>
                                <option value="withChildren">Registering with children</option>
                                <option value="childrenOnly">Registering only for your child/children</option>
                            </select>
                        </div>


                        {(registerFor === "withChildren" || registerFor === "childrenOnly") && (
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
                                            <option value="Others">others</option>

                                        </select>
                                        <button type="button" onClick={() => handleRemoveChild(index)} className="remove-child">
                                            Remove Child
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={handleAddChild} className="add-child">
                                + add child
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