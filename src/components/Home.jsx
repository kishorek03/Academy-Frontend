import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [countdown, setCountdown] = useState(0);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [profilePicture, setProfilePicture] = useState('./image.png'); // Default image in the public folder

    const fetchUserDetails = async (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser({
                name: payload.sub,
                id: payload.userId, // Assuming userId is in the token payload
            });
            // Fetch the profile picture
            const response = await axios.get(`/profile/picture/${payload.userId}`);
            if (response.data && response.data.profilePictureUrl) {
                setProfilePicture(response.data.profilePictureUrl);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const startCountdown = useCallback(
        (token) => {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expirationTime = payload.exp * 1000;
                const currentTime = Date.now();
                const remainingTime = expirationTime - currentTime;

                if (remainingTime > 0) {
                    const interval = setInterval(() => {
                        const newRemainingTime = expirationTime - Date.now();
                        setCountdown(Math.floor(newRemainingTime / 1000));

                        if (newRemainingTime <= 0) {
                            clearInterval(interval);
                            navigate('/login');
                        }
                    }, 1000);
                }
            } catch (error) {
                console.error('Error calculating countdown:', error);
            }
        },
        [navigate]
    );

    const isTokenExpired = (token) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp < Date.now() / 1000;
        } catch (error) {
            console.error('Error parsing token:', error);
            return true;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token || isTokenExpired(token)) {
            navigate('/login');
        } else {
            fetchUserDetails(token);
            startCountdown(token);
        }
    }, [navigate, startCountdown]);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const handleProfilePictureClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file && user && user.id) {
            if (!file.type.startsWith('image/')) {
                alert('Please upload a valid image file.');
                return;
            }
    
            try {
                const formData = new FormData();
                formData.append('file', file);
    
                const response = await axios.post(
                    `/profile/upload/${user.id}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
    
                if (response.data && response.data.profilePictureUrl) {
                    setProfilePicture(response.data.profilePictureUrl); // Update the profile picture URL
                    alert('Profile picture updated successfully');
                } else {
                    throw new Error('Profile picture URL not found in response');
                }
            } catch (error) {
                console.error('Error uploading profile picture:', error);
                alert('Failed to upload profile picture');
            }
        }
    };    

    if (!user) {
        return <div>Loading...</div>;
    }
    const styles = {
        homeContainer: {
            textAlign: 'center',
            padding: '40px',
            position: 'relative',
        },
        header: {
            fontSize: '36px',
            color: '#1de5f7',
        },
        profileIcon: {
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            borderRadius: '50%',
            objectFit: 'cover',
        },
        dropdownToggle: {
            fontSize: '25px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px',
        },
        profileDropdown: {
            position: 'absolute',
            right: '20px',
            top: '20px',
        },
        dropdownMenu: {
            position: 'absolute',
            right: 0,
            top: '100%',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '10px',
            minWidth: '150px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        },
        logoutButton: {
            background: 'linear-gradient(90deg, #ff7a00, #ff2a68)',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '4px',
            padding: '10px',
            textAlign: 'center',
            cursor: 'pointer',
        },
        navbar: {
            font: 'Segoe UI',
            fontSize: '30px',
            textAlign: 'center',
            padding: '10px 20px',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '2px solid white', // Adds a white line below the navbar
            alignItems: 'center',
            flexWrap: 'wrap', // Allow items to wrap on small screens
        },
        nav: {
            backgroundColor: 'white',
            boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.1)',
            borderBottom: '2px solid white', // Adds a white line below the navbar
        },
        navbarLink: {
            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
            padding: '23px 10px',
            color: 'white',
            cursor: 'pointer',
            textDecoration: 'none',
            fontSize: '20px',
            marginRight: '20px',
            position: 'relative',
            display: 'inline-block',
            transition: 'color 0.3s ease, transform 0.3s ease',
            '&:hover': {
                color: '#ff2a68',
                transform: 'scale(1.1)',
                textShadow: '0 0 10px rgba(255, 42, 104, 0.5)',
            },
            '&:after': {
            content: '""',
            position: 'absolute',
            bottom: '0', // Positions underline at the bottom
            left: '0',
            width: '100%',
            height: '2px',
            backgroundColor: 'white',
            transform: 'scaleX(0)', // Start with no underline
            transformOrigin: 'left',
            transition: 'transform 0.3s ease', // Smooth transition
        },
        '&:hover:after': {
            transform: 'scaleX(1)', // Expand underline on hover
        },
    },       
        // Media Queries for responsiveness
        '@media (max-width: 768px)': {
            homeContainer: {
                padding: '20px',
            },
            header: {
                fontSize: '28px',
            },
            profileIcon: {
                width: '40px',
                height: '40px',
            },
            navbar: {
                fontSize: '24px',
                flexDirection: 'column', // Stack the navbar items vertically
                alignItems: 'flex-start',
            },
            navbarLink: {
                fontSize: '18px',
                marginBottom: '10px',
            },
            profileDropdown: {
                position: 'relative',
                marginTop: '10px',
            },
            dropdownMenu: {
                minWidth: '120px', // Reduce the width of dropdown on smaller screens
                padding: '8px',
            },
            logoutButton: {
                padding: '8px',
            },
        },
    
        '@media (max-width: 480px)': {
            header: {
                fontSize: '24px',
            },
            profileIcon: {
                width: '20px',
                height: '20px',
            },
            navbar: {
                fontSize: '20px',
            },
            navbarLink: {
                fontSize: '16px',
                marginRight: '0',
                marginBottom: '8px',
            },
        },
    };
    
    

    return (
        <div>
            {/* Navbar */}
            <div style={styles.navbar}>
                <div>Table Tennis Academy</div>
                <div>
                    <a href="/profile" style={styles.navbarLink}>Profile</a>
                    <a href="/Announcements" style={styles.navbarLink}>Announcements</a>
                    <a href="/Fee" style={styles.navbarLink}>Fee</a>
                    <a href="/settings" style={styles.navbarLink}>Settings</a>
                </div>
            </div>
            <div style={styles.homeContainer}>
                <h1 style={styles.header}>Welcome, {user.name}!</h1>
                <h2>It's great to have you back.</h2>

                <div style={styles.profileDropdown}>
                    <button
                        onClick={handleProfilePictureClick}
                        style={{ background: 'none', border: 'none', padding: 0 }}
                    >
                       <img
                            src={profilePicture}
                            alt="" // Added alt attribute
                            style={styles.profileIcon}
                        />
                    </button>
                    <input
                        type="file"
                        id="fileInput"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <p
                        onClick={toggleDropdown}
                        style={styles.dropdownToggle}
                    >{`Hi, ${user.name}`}</p>
                    {dropdownVisible && (
                        <div style={styles.dropdownMenu}>
                            <p>Session expires in {countdown > 0 ? countdown : 'Expired'} seconds</p>
                            <hr />
                            <button style={styles.logoutButton} onClick={handleLogout}>
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
