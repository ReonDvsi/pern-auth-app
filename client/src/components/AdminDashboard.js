import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminMap from './AdminMap';
import socketService from '../services/socketService';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeCheckIns, setActiveCheckIns] = useState([]);
  const [completedCheckIns, setCompletedCheckIns] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [activeView, setActiveView] = useState('active'); // 'active' or 'completed'

  useEffect(() => {
    // Connect to socket
    socketService.connect();
    socketService.joinAdminRoom();

    // Fetch initial data
    fetchActiveCheckIns();
    fetchCompletedCheckIns();

    // Set up socket listeners for real-time updates
    socketService.onNewCheckIn((data) => {
      console.log('New check-in received:', data);
      setActiveCheckIns(prev => [...prev, {
        ...data,
        latitude: data.latitude || data.site_latitude,
        longitude: data.longitude || data.site_longitude,
        site_name: data.site_name || data.site_name
      }]);
    });

    socketService.onCheckOut((data) => {
      console.log('Check-out received:', data);
      setActiveCheckIns(prev => prev.filter(ci => ci.id !== data.checkInId));
      fetchCompletedCheckIns();
    });

    return () => {
      socketService.removeListeners();
      socketService.disconnect();
    };
  }, []);

  const fetchActiveCheckIns = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/checkins/all-active`);
      setActiveCheckIns(response.data);
    } catch (error) {
      console.error('Error fetching active check-ins:', error);
    }
  };

  const fetchCompletedCheckIns = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/checkins/all-completed`);
      setCompletedCheckIns(response.data);
    } catch (error) {
      console.error('Error fetching completed check-ins:', error);
    }
  };

  const handleMarkerClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (checkIn, checkOut = null) => {
    const start = new Date(checkIn);
    const end = checkOut ? new Date(checkOut) : new Date();
    const duration = end - start;
    const hours = Math.floor(duration / 3600000);
    const minutes = Math.floor((duration % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const todaysCompletedCount = completedCheckIns.filter(ci => 
    new Date(ci.check_out_time).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="admin-dashboard-container">
      <header className="admin-header">
        <div className="header-content">
          <div className="header-left">
            <img src="/DVSI-logo.png" alt="DVSI" className="dvsi-logo" />
          </div>
          <div className="header-center">
            <h1 className="dashboard-title">Admin Dashboard</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-badge">Admin</span>
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

      <main className="admin-main">
        {/* Large Map Section */}
        <div className="map-section-large">
          <AdminMap 
            activeCheckIns={activeCheckIns}
            onMarkerClick={handleMarkerClick}
            selectedEmployee={selectedEmployee}
          />
        </div>

        {/* Stats and Details Section */}
        <div className="details-section">
          <div className="stats-container">
            <button
              className={`stat-card clickable ${activeView === 'active' ? 'selected' : ''}`}
              onClick={() => setActiveView('active')}
            >
              <div className="stat-icon active">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#34C759" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="3" fill="#34C759"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{activeCheckIns.length}</div>
                <div className="stat-label">Active Check-ins</div>
              </div>
            </button>
            
            <button
              className={`stat-card clickable ${activeView === 'completed' ? 'selected' : ''}`}
              onClick={() => setActiveView('completed')}
            >
              <div className="stat-icon completed">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-content">
                <div className="stat-value">{todaysCompletedCount}</div>
                <div className="stat-label">Completed Today</div>
              </div>
            </button>
          </div>

          {activeView === 'active' ? (
            <div className="employees-grid">
              <div className="section-header">
                <h2>Active Employees</h2>
                <span className="employee-count">{activeCheckIns.length} employees on site</span>
              </div>
              
              {activeCheckIns.length === 0 ? (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="23" stroke="#E5E5EA" strokeWidth="2"/>
                    <path d="M24 16V24M24 32H24.01" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <p>No active check-ins at the moment</p>
                </div>
              ) : (
                <div className="employee-cards-grid">
                  {activeCheckIns.map(checkIn => (
                    <div 
                      key={checkIn.id} 
                      className={`employee-card ${selectedEmployee?.id === checkIn.id ? 'selected' : ''}`}
                      onClick={() => handleMarkerClick(checkIn)}
                    >
                      <div className="employee-card-header">
                        <div className="employee-avatar">
                          {checkIn.first_name.charAt(0)}{checkIn.last_name.charAt(0)}
                        </div>
                        <div className="employee-info">
                          <h4>{checkIn.first_name} {checkIn.last_name}</h4>
                          <p>{checkIn.email}</p>
                        </div>
                      </div>
                      <div className="employee-card-details">
                        <div className="detail-item">
                          <span className="detail-icon">📍</span>
                          <span>{checkIn.site_name}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">⏱️</span>
                          <span>{calculateDuration(checkIn.check_in_time)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-icon">📝</span>
                          <span className="reason-text">{checkIn.reason_for_visit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="employees-grid">
              <div className="section-header">
                <h2>Completed Today</h2>
                <span className="employee-count">{todaysCompletedCount} check-outs today</span>
              </div>
              
              {todaysCompletedCount === 0 ? (
                <div className="empty-state">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="23" stroke="#E5E5EA" strokeWidth="2"/>
                    <path d="M24 16V24M24 32H24.01" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <p>No completed check-outs today</p>
                </div>
              ) : (
                <div className="employee-cards-grid">
                  {completedCheckIns
                    .filter(ci => new Date(ci.check_out_time).toDateString() === new Date().toDateString())
                    .map(checkIn => (
                      <div key={checkIn.id} className="employee-card">
                        <div className="employee-header">
                          <div className="employee-avatar completed">
                            {checkIn.first_name.charAt(0)}{checkIn.last_name.charAt(0)}
                          </div>
                          <div className="employee-info">
                            <h3>{checkIn.first_name} {checkIn.last_name}</h3>
                            <p className="employee-email">{checkIn.email}</p>
                          </div>
                        </div>
                        
                        <div className="employee-details">
                          <div className="detail-item">
                            <span className="detail-icon">📍</span>
                            <span>{checkIn.site_name}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-icon">⏱️</span>
                            <span>{calculateDuration(checkIn.check_in_time, checkIn.check_out_time)}</span>
                          </div>
                        </div>

                        <div className="check-times">
                          <div className="time-row">
                            <span className="time-label">Check-in:</span>
                            <span className="time-value">{formatTime(checkIn.check_in_time)}</span>
                          </div>
                          <div className="time-row">
                            <span className="time-label">Check-out:</span>
                            <span className="time-value">{formatTime(checkIn.check_out_time)}</span>
                          </div>
                        </div>

                        <div className="feedback-section">
                          <div className="feedback-header">
                            <span className="detail-icon">💬</span>
                            <span>Feedback</span>
                          </div>
                          <div className="feedback-content">
                            <div className="feedback-item">
                              <span className="feedback-label">What went well:</span>
                              <p className="feedback-text">{checkIn.feedback_good || 'No feedback provided'}</p>
                            </div>
                            <div className="feedback-item">
                              <span className="feedback-label">What needs attention:</span>
                              <p className="feedback-text">{checkIn.feedback_bad || 'No feedback provided'}</p>
                            </div>
                            <div className="feedback-item">
                              <span className="feedback-label">Suggestions:</span>
                              <p className="feedback-text">{checkIn.feedback_suggestions || 'No suggestions'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;