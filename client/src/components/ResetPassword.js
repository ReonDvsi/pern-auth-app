import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ResetPassword.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return 'Weak';
    if (password.length < 8) return 'Medium';
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      return 'Strong';
    }
    return 'Medium';
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordStrength(checkPasswordStrength(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await resetPassword(token, password);

    if (result.success) {
      setResetSuccess(true);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  if (resetSuccess) {
    return (
      <div className="icloud-reset-page">
        <header className="icloud-header">
          <div className="header-content">
            <div className="header-logo">
              <img src="/DVSI-logo.png" alt="DVSI" className="dvsi-logo" />
            </div>
          </div>
        </header>

        <main className="icloud-main">
          <div className="reset-card success-card">
            <div className="success-icon">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="30" fill="#34C759" fillOpacity="0.2"/>
                <path d="M20 30L26 36L40 22" stroke="#34C759" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="success-title">Password Reset Successful!</h2>
            <p className="success-message">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <button 
              onClick={() => navigate('/login')} 
              className="sign-in-button"
            >
              Sign In
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="icloud-reset-page">
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
        <div className="reset-card">
          <div className="logo-section">
            <div className="logo-circle-container">
              <img src="/just-logo.png" alt="Logo" className="center-logo" style={{width: 128, height: 128}} />
            </div>
          </div>

          <h1 className="reset-title">Set New Password</h1>
          <p className="reset-subtitle">
            Create a strong password for your account
          </p>

          {error && (
            <div className="error-banner">
              <span className="error-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="reset-form">
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
                placeholder="New Password"
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

            {password && (
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
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm New Password"
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
              className="update-password-button"
              disabled={loading || !password || !confirmPassword}
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;