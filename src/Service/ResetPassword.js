import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false); // Disable button after reset
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // Navigate to login page
  const token = searchParams.get("token"); // Retrieve the token from query parameters

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Validation: Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setMessage("");
      console.log("Error: Passwords do not match");
      return;
    }

    // Validation: Check password format
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d).{7,}$/;
    if (!passwordPattern.test(password)) {
      setError(
        "Password must contain at least one letter, one number, and be at least 7 characters long."
      );
      setMessage("");
      console.log("Error: Password does not meet the required criteria.");
      return;
    }

    try {
      // API call to reset password
      const response = await axios.post(
        "http://localhost:8080/login/reset-password",
        null, // Passing `null` for body to include form data
        {
          params: {
            token, // Pass token from query params
            newPassword: password, // Pass newPassword from state
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded", // Form URL encoded
          },
        }
      );

      setMessage(response.data || "Password reset successfully!"); // Display success message
      setError("");
      setButtonDisabled(true); // Disable the button
      console.log("Password reset successful:", response.data);
    } catch (err) {
      // Handle errors
      setError(
        err.response?.data || "An error occurred. Please try again later."
      );
      setMessage("");
      console.error("Error resetting password:", err.response?.data);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleResetPassword}>
        <h2 className="login-title">Reset Password</h2>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {!buttonDisabled && (
          <>
            <div className="input-container">
              <input
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-container">
              <input
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={buttonDisabled}
            >
              Reset Password
            </button>
          </>
        )}

        {buttonDisabled && (
          <div className="login-footer1">
            <p
              onClick={handleBackToLogin}
              className="back-to-login-link"
            >
              Back to Login
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
