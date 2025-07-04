import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './EmailVerification.css';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  const handleVerification = useCallback(async (token) => {
    const result = await verifyEmail(token);
    
    if (result.success) {
      setStatus('success');
      setMessage('Email verified successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setStatus('error');
      setMessage(result.error);
    }
  }, [verifyEmail, navigate]);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      handleVerification(token);
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [searchParams, handleVerification]);

  return (
    <div className="icloud-verification-page">
      <header className="icloud-header">
        <div className="header-content">
          <div className="header-logo">
            <img src="/DVSI-logo.png" alt="DVSI" className="dvsi-logo" />
          </div>
        </div>
      </header>

      <main className="icloud-main">
        <div className="verification-card">
          {status === 'verifying' && (
            <>
              <div className="verification-icon">
                <div className="loading-spinner large"></div>
              </div>
              <h2 className="verification-title">Verifying Your Email</h2>
              <p className="verification-message">
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="verification-icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="40" fill="#34C759" fillOpacity="0.1"/>
                  <circle cx="40" cy="40" r="30" stroke="#34C759" strokeWidth="2"/>
                  <path d="M28 40L35 47L52 30" stroke="#34C759" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="verification-title">Email Verified!</h2>
              <p className="verification-message success">
                {message}
              </p>
              <div className="countdown">
                Redirecting in 3 seconds...
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="verification-icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="40" fill="#FF3B30" fillOpacity="0.1"/>
                  <circle cx="40" cy="40" r="30" stroke="#FF3B30" strokeWidth="2"/>
                  <path d="M50 30L30 50M30 30L50 50" stroke="#FF3B30" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 className="verification-title">Verification Failed</h2>
              <p className="verification-message error">
                {message}
              </p>
              <div className="verification-actions">
                <Link to="/login" className="action-button primary">
                  Go to Login
                </Link>
                <Link to="/register" className="action-button secondary">
                  Create New Account
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmailVerification;