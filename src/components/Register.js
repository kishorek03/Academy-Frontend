import React, { useState } from 'react';
import '../styles/Register.css';

function Register() {
    const [username, setUsername] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [isRegisteringForChild, setIsRegisteringForChild] = useState(false);
    const [children, setChildren] = useState([{ name: '', age: '', gender: '' }]);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            username,
            gender,
            email,
            password,
            mobile,
            children: isRegisteringForChild ? children : []
        };

        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                setMessage('Registration successful!');
                // Clear form fields after successful registration
                setUsername('');
                setGender('');
                setEmail('');
                setPassword('');
                setMobile('');
                setIsRegisteringForChild(false);
                setChildren([{ name: '', age: '', gender: '' }]);
            } else {
                setMessage('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('An error occurred. Please try again.');
        }
    };

    const handleChildChange = (index, field, value) => {
        const updatedChildren = [...children];
        updatedChildren[index][field] = value;
        setChildren(updatedChildren);
    };

    const addChild = () => {
        setChildren([...children, { name: '', age: '', gender: '' }]);
    };

    const removeChild = (index) => {
        const updatedChildren = children.filter((_, i) => i !== index);
        setChildren(updatedChildren);
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2 className="register-title">Registration Form</h2>

                {message && <p className="message">{message}</p>}

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
                        type="email"
                        placeholder="Email"
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

                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Mobile Number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                    />
                </div>

                <div className="input-container-checkbox">
                    <input
                        type="checkbox"
                        checked={isRegisteringForChild}
                        onChange={() => setIsRegisteringForChild(!isRegisteringForChild)}
                    />
                    <label>Are you registering for children?</label>
                </div>

                {isRegisteringForChild &&
                    children.map((child, index) => (
                        <div key={index} className="child-section">
                            <h3>Child {index + 1}</h3>

                            <div className="input-container">
                                <input
                                    type="text"
                                    placeholder="Child's Name"
                                    value={child.name}
                                    onChange={(e) =>
                                    handleChildChange(index, 'name', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="input-container">
                                <input
                                    type="number"
                                    placeholder="Child's Age"
                                    value={child.age}
                                    onChange={(e) =>
                                        handleChildChange(index, 'age', e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="input-container">
                                <select
                                    value={child.gender}
                                    onChange={(e) =>
                                        handleChildChange(index, 'gender', e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>

                            <button type="button" className="remove-child" onClick={() => removeChild(index)}>
                                Remove Child
                            </button>
                        </div>
                    ))}

                {isRegisteringForChild && (
                    <button type="button" className="add-child" onClick={addChild}>
                        Add Another Child
                    </button>
                )}

                <button type="submit" className="register-button">Create Account</button>
            </form>
        </div>
    );
}

export default Register;
