import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await forgotPassword(email);

    if (result.success) {
      setEmailSent(true);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  if (emailSent) {
    return (
      <div className="icloud-forgot-page">
        <header className="icloud-header">
          <div className="header-content">
            <div className="header-logo">
              <img src="/DVSI-logo.png" alt="DVSI" className="dvsi-logo" />
            </div>
          </div>
        </header>

        <main className="icloud-main">
          <div className="forgot-card success-card">
            <div className="email-icon">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="30" fill="#007AFF" fillOpacity="0.1"/>
                <path d="M20 22L30 28L40 22M20 22V38H40V22M20 22H40" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="success-title">Check Your Email</h2>
            <p className="success-message">
              We've sent password reset instructions to:
              <br />
              <strong>{email}</strong>
            </p>
            <p className="success-note">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <Link to="/login" className="back-to-login-button">
              Back to Sign In
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="icloud-forgot-page">
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
        <div className="forgot-card">
          <div className="logo-section">
            <div className="logo-circle-container">
              <img src="/just-logo.png" alt="Logo" className="center-logo" style={{width: 128, height: 128}} />
            </div>
          </div>

          <h1 className="forgot-title">Reset Your Password</h1>
          <p className="forgot-subtitle">
            Enter your email address and we'll send you instructions to reset your password.
          </p>

          {error && (
            <div className="error-banner">
              <span className="error-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="forgot-form">
            <div className="input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email Address"
                className="icloud-input"
                autoComplete="email"
              />
              {email && (
                <button
                  type="button"
                  className="clear-button"
                  onClick={() => setEmail('')}
                  aria-label="Clear email"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="7" fill="#C7C7CC"/>
                    <path d="M10.5 5.5L5.5 10.5M5.5 5.5L10.5 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>

            <button 
              type="submit" 
              className="reset-button"
              disabled={loading || !email}
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="back-link-container">
            <Link to="/login" className="back-link">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;