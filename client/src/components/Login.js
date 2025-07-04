import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password, rememberMe);
    
    if (result.success) {
      navigate('/hello');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const result = await googleLogin(credentialResponse.credential);
    
    if (result.success) {
      navigate('/hello');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="icloud-login-page">
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
        <div className="login-card">
          <div className="logo-section">
            <div className="logo-circle-container">
              <img src="/just-logo.png" alt="Logo" className="center-logo" style={{width: 128, height: 128}} />
            </div>
          </div>

          <h1 className="login-title">Sign in with DVSI Account</h1>

          {error && (
            <div className="error-banner">
              <span className="error-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email or Phone Number"
                className="icloud-input"
                autoComplete="username"
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

            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="icloud-input"
                autoComplete="current-password"
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

            <button 
              type="submit" 
              className="signin-arrow-button"
              disabled={loading || !email || !password}
              aria-label="Sign in"
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9H15M15 9L9 3M15 9L9 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </form>

          <div className="options-section">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="remember-checkbox"
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-label">Keep me signed in</span>
            </label>
          </div>

          <div className="links-container">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot password? →
            </Link>
            <Link to="/register" className="create-account-link">
              Create DVSI Account
            </Link>
          </div>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="google-signin-wrapper">
            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google login failed')}
                type="standard"
                theme="outline"
                size="large"
                text="signin_with"
                width="280"
              />
            </GoogleOAuthProvider>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;