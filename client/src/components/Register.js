import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { register } = useAuth();

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return 'Weak';
    if (password.length < 8) return 'Medium';
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      return 'Strong';
    }
    return 'Medium';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register(
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.password
    );

    if (result.success) {
      setShowMessage(true);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  if (showMessage) {
    return (
      <div className="icloud-register-page">
        <header className="icloud-header">
          <div className="header-content">
            <div className="header-logo">
              <img src="/DVSI-logo.png" alt="DVSI" className="dvsi-logo" />
            </div>
          </div>
        </header>

        <main className="icloud-main">
          <div className="register-card success-card">
            <div className="success-icon">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="30" fill="#34C759" fillOpacity="0.2"/>
                <path d="M20 30L26 36L40 22" stroke="#34C759" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="success-title">Registration Successful!</h2>
            <p className="success-message">
              Account registered successfully. Please check your email to verify your account.
            </p>
            <Link to="/login" className="back-to-login-button">
              Go to Login
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="icloud-register-page">
      <header className="icloud-header">
        <div className="header-content">
          <div className="header-logo">
            <img src="/DVSI-logo.png" alt="DVSI" className="dvsi-logo" />
          </div>
          <div className="header-menu">
            <button 
              className="menu-button"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Menu"
            >
              <span className="menu-dot"></span>
              <span className="menu-dot"></span>
              <span className="menu-dot"></span>
            </button>
            {showMenu && (
              <div className="menu-dropdown">
                <a href="https://www.dvsi.com/" target="_blank" rel="noopener noreferrer">
                  Visit DVSI Website
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="icloud-main">
        <div className="register-card">
          <div className="logo-section">
            <div className="logo-circle-container">
              <img src="/just-logo.png" alt="Logo" className="center-logo" style={{width: 128, height: 128}} />
            </div>
          </div>

          <h1 className="register-title">Create DVSI Account</h1>

          {error && (
            <div className="error-banner">
              <span className="error-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="name-row">
              <div className="input-wrapper">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="First Name"
                  className="icloud-input"
                />
              </div>

              <div className="input-wrapper">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Last Name"
                  className="icloud-input"
                />
              </div>
            </div>

            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email Address"
                className="icloud-input"
                autoComplete="email"
              />
              {formData.email && (
                <button
                  type="button"
                  className="clear-button"
                  onClick={() => setFormData(prev => ({ ...prev, email: '' }))}
                  aria-label="Clear email"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="7" fill="#C7C7CC"/>
                    <path d="M10.5 5.5L5.5 10.5M5.5 5.5L10.5 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>

            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="icloud-input"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                  {showPassword ? (
                    <>
                      <path d="M11 1C15.5 1 19.5 4.5 20.5 8C19.5 11.5 15.5 15 11 15C6.5 15 2.5 11.5 1.5 8C2.5 4.5 6.5 1 11 1Z" stroke="#007AFF" strokeWidth="1.5"/>
                      <circle cx="11" cy="8" r="3" stroke="#007AFF" strokeWidth="1.5"/>
                      <path d="M2 14L20 2" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round"/>
                    </>
                  ) : (
                    <>
                      <path d="M11 1C15.5 1 19.5 4.5 20.5 8C19.5 11.5 15.5 15 11 15C6.5 15 2.5 11.5 1.5 8C2.5 4.5 6.5 1 11 1Z" stroke="#007AFF" strokeWidth="1.5"/>
                      <circle cx="11" cy="8" r="3" stroke="#007AFF" strokeWidth="1.5"/>
                    </>
                  )}
                </svg>
              </button>
            </div>

            {formData.password && (
              <div className={`password-strength-indicator ${passwordStrength.toLowerCase()}`}>
                <div className="strength-bars">
                  <span className="strength-bar"></span>
                  <span className="strength-bar"></span>
                  <span className="strength-bar"></span>
                </div>
                <span className="strength-text">Password strength: {passwordStrength}</span>
              </div>
            )}

            <div className="input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm Password"
                className="icloud-input"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                  {showConfirmPassword ? (
                    <>
                      <path d="M11 1C15.5 1 19.5 4.5 20.5 8C19.5 11.5 15.5 15 11 15C6.5 15 2.5 11.5 1.5 8C2.5 4.5 6.5 1 11 1Z" stroke="#007AFF" strokeWidth="1.5"/>
                      <circle cx="11" cy="8" r="3" stroke="#007AFF" strokeWidth="1.5"/>
                      <path d="M2 14L20 2" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round"/>
                    </>
                  ) : (
                    <>
                      <path d="M11 1C15.5 1 19.5 4.5 20.5 8C19.5 11.5 15.5 15 11 15C6.5 15 2.5 11.5 1.5 8C2.5 4.5 6.5 1 11 1Z" stroke="#007AFF" strokeWidth="1.5"/>
                      <circle cx="11" cy="8" r="3" stroke="#007AFF" strokeWidth="1.5"/>
                    </>
                  )}
                </svg>
              </button>
            </div>

            <button 
              type="submit" 
              className="create-account-button"
              disabled={loading || !formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword}
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="signin-link-container">
            <span>Already have an account?</span>
            <Link to="/login" className="signin-link">Sign In →</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;