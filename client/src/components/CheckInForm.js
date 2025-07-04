import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CheckInForm.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CheckInForm = ({ onCheckIn, onClose }) => {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/sites/all`);
      setSites(response.data);
    } catch (error) {
      console.error('Error fetching sites:', error);
      setError('Failed to load sites');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/checkins/checkin`, {
        siteId: selectedSite,
        reasonForVisit
      });
      onCheckIn(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkin-form-card">
      <div className="form-icon">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="30" fill="#007AFF" fillOpacity="0.1"/>
          <path d="M30 15V30M30 30L37.5 22.5M30 30H45" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="30" cy="30" r="14" stroke="#007AFF" strokeWidth="2"/>
        </svg>
      </div>

      <h2 className="form-title">Check In to Site</h2>
      <p className="form-subtitle">Select your site and enter the reason for your visit</p>

      {error && (
        <div className="error-banner">
          <span className="error-icon">!</span>
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="checkin-form">
        <div className="form-group">
          <label className="form-label">Site Location</label>
          <div className="select-wrapper">
            <select
              value={selectedSite}
              onChange={(e) => setSelectedSite(e.target.value)}
              required
              className="site-select"
            >
              <option value="">Choose a site...</option>
              {sites.map(site => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
            <svg className="select-arrow" width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M1 1L6 6L11 1" stroke="#8e8e93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Reason for Visit</label>
          <textarea
            value={reasonForVisit}
            onChange={(e) => setReasonForVisit(e.target.value)}
            placeholder="Enter the purpose of your visit..."
            required
            className="reason-textarea"
            rows="3"
          />
        </div>

        <button 
          type="submit" 
          className="checkin-button"
          disabled={loading || !selectedSite || !reasonForVisit}
        >
          {loading ? (
            <span className="loading-spinner"></span>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 10L8 13L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Check In
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckInForm;