import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CheckInForm from './CheckInForm';
import CheckOutForm from './CheckOutForm';
import axios from 'axios';
import './EmployeeDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeCheckIn, setActiveCheckIn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState('00:00:00');
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Ensure axios has the token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    fetchActiveCheckIn();
  }, []);

  useEffect(() => {
    let interval;
    if (activeCheckIn) {
      interval = setInterval(() => {
        const duration = new Date() - new Date(activeCheckIn.check_in_time);
        const hours = Math.floor(duration / 3600000);
        const minutes = Math.floor((duration % 3600000) / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        setTimer(
          `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCheckIn]);

  const fetchActiveCheckIn = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/checkins/active`);
      if (response.data) {
        setActiveCheckIn(response.data);
      } else {
        // Explicitly set to null if no active check-in
        setActiveCheckIn(null);
      }
    } catch (error) {
      console.error('Error fetching active check-in:', error);
      // If 404 or no active check-in, set to null
      if (error.response?.status === 404) {
        setActiveCheckIn(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = (checkInData) => {
    setActiveCheckIn(checkInData);
  };

  const handleCheckOut = () => {
    setActiveCheckIn(null);
    setTimer('00:00:00');
    // Fetch again to ensure we have the latest state
    fetchActiveCheckIn();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="icloud-employee-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="icloud-employee-page">
      <header className="icloud-header">
        <div className="header-content">
          <div className="header-logo">
            <img src="/DVSI-logo.png" alt="DVSI" className="dvsi-logo" />
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{user?.firstName} {user?.lastName}</span>
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
                  <div className="menu-user-section">
                    <div className="menu-user-name">{user?.firstName} {user?.lastName}</div>
                    <div className="menu-user-email">{user?.email}</div>
                  </div>
                  <div className="menu-divider"></div>
                  <a href="https://www.dvsi.com/" target="_blank" rel="noopener noreferrer">
                    Visit DVSI Website
                  </a>
                  <button onClick={handleLogout} className="menu-logout">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="icloud-main">
        <div className="dashboard-container">
          {activeCheckIn && (
            <div className="timer-section">
              <div className="timer-card">
                <h3 className="timer-label">Session Duration</h3>
                <div className="timer-display">{timer}</div>
                <div className="timer-site">{activeCheckIn.site_name}</div>
              </div>
            </div>
          )}

          <div className="action-section">
            {!activeCheckIn ? (
              <CheckInForm onCheckIn={handleCheckIn} />
            ) : (
              <CheckOutForm 
                activeCheckIn={activeCheckIn} 
                onCheckOut={handleCheckOut} 
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;