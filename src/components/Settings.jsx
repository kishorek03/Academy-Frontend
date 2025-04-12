import React, { useState, useEffect } from "react";
import "../styles/Settings.css";

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [profilePrivacy, setProfilePrivacy] = useState("public");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("english");

  // Password states
  const [changePassword, setChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Phone number states
  const [changePhone, setChangePhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [confirmPhone, setConfirmPhone] = useState("");

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);

  const validate = () => {
    const newErrors = {};

    if (changePassword) {
      if (!newPassword || !confirmPassword) {
        newErrors.password = "Both password fields are required.";
      } else if (newPassword !== confirmPassword) {
        newErrors.password = "Passwords do not match.";
      } else if (!/^(?=.*[a-zA-Z])(?=.*\d).{7,}$/.test(newPassword)) {
        newErrors.password =
          "Password must be at least 7 characters with letters and numbers.";
      }
    }

    if (changePhone) {
      if (!phone || !confirmPhone) {
        newErrors.phone = "Both phone number fields are required.";
      } else if (!/^\d{10}$/.test(phone) || !/^\d{10}$/.test(confirmPhone)) {
        newErrors.phone = "Phone numbers must be exactly 10 digits.";
      } else if (phone !== confirmPhone) {
        newErrors.phone = "Phone numbers do not match.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    alert("Settings saved successfully!");
  };

  return (
    <div className="settings-container">
      <h2 className="settings-heading">Account Settings</h2>
      <form onSubmit={handleSubmit} className="settings-form">
        {/* Change Password */}
        <div className="settings-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={changePassword}
              onChange={(e) => setChangePassword(e.target.checked)}
            />
            Change Password
          </label>
        </div>
        {changePassword && (
          <>
            <div className="settings-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="settings-group">
              <label>Re-enter New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
              />
              {errors.password && (
                <span className="error">{errors.password}</span>
              )}
            </div>
          </>
        )}

        {/* Change Phone */}
        <div className="settings-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={changePhone}
              onChange={(e) => setChangePhone(e.target.checked)}
            />
            Change Phone Number
          </label>
        </div>
        {changePhone && (
          <>
            <div className="settings-group">
              <label>New Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
              />
            </div>
            <div className="settings-group">
              <label>Re-enter New Phone Number</label>
              <input
                type="tel"
                value={confirmPhone}
                onChange={(e) => setConfirmPhone(e.target.value)}
                placeholder="Re-enter phone number"
              />
              {errors.phone && <span className="error">{errors.phone}</span>}
            </div>
          </>
        )}

        {/* Notifications */}
        <div className="settings-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
            Receive Email Notifications
          </label>
        </div>

        {/* Privacy */}
        <div className="settings-group">
          <label>Profile Privacy</label>
          <select
            value={profilePrivacy}
            onChange={(e) => setProfilePrivacy(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="friends">Friends Only</option>
          </select>
        </div>

        {/* Language */}
        <div className="settings-group">
          <label>Preferred Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="tamil">Tamil</option>
            <option value="telugu">Telugu</option>
          </select>
        </div>

        {/* Dark Mode */}
        <div className="settings-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            Enable Dark Mode
          </label>
        </div>

        {/* Submit */}
        <div className="settings-group">
          <button type="submit" className="save-btn">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
