import React, { useState } from 'react';
import axios from 'axios';
import './CheckOutForm.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const CheckOutForm = ({ activeCheckIn, onCheckOut }) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState({
    good: '',
    bad: '',
    suggestions: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckOutClick = () => {
    setShowFeedback(true);
  };

  const handleFeedbackChange = (field, value) => {
    setFeedback(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post(`${API_URL}/api/checkins/checkout`, {
        checkInId: activeCheckIn.id,
        feedback
      });
      onCheckOut();
    } catch (error) {
      setError(error.response?.data?.message || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!showFeedback) {
    return (
      <div className="checkout-form-card">
        <div className="status-icon">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <circle cx="30" cy="30" r="30" fill="#34C759" fillOpacity="0.1"/>
            <circle cx="30" cy="30" r="8" fill="#34C759"/>
            <path d="M30 18V30L36 36" stroke="#34C759" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>

        <h2 className="form-title">Currently Checked In</h2>
        
        <div className="checkin-info-card">
          <div className="info-row">
            <span className="info-label">Site</span>
            <span className="info-value">{activeCheckIn.site_name}</span>
          </div>
          <div className="info-divider"></div>
          <div className="info-row">
            <span className="info-label">Check-in Time</span>
            <span className="info-value">{formatTime(activeCheckIn.check_in_time)}</span>
          </div>
          <div className="info-divider"></div>
          <div className="info-row">
            <span className="info-label">Reason</span>
            <span className="info-value">{activeCheckIn.reason_for_visit}</span>
          </div>
        </div>

        <button onClick={handleCheckOutClick} className="checkout-button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="white" strokeWidth="2"/>
            <path d="M7 10H13M13 10L10 7M13 10L10 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Check Out
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-form-card">
      <div className="form-header">
        <button 
          className="back-button"
          onClick={() => setShowFeedback(false)}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 16L6 10L12 4" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h2 className="form-title">Check Out Feedback</h2>
        <div style={{ width: '20px' }}></div>
      </div>

      <p className="form-subtitle">Please share your experience from today's visit</p>

      {error && (
        <div className="error-banner">
          <span className="error-icon">!</span>
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label className="form-label">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="label-icon">
              <path d="M10 2L12.09 7.26L18 8.27L14 12.14L14.81 18L10 15.27L5.19 18L6 12.14L2 8.27L7.91 7.26L10 2Z" fill="#FFD60A" stroke="#FFD60A" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
            What went well today?
          </label>
          <textarea
            value={feedback.good}
            onChange={(e) => handleFeedbackChange('good', e.target.value)}
            rows="3"
            required
            className="feedback-textarea"
            placeholder="Share the positive aspects of your visit..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="label-icon">
              <circle cx="10" cy="10" r="8" stroke="#FF9500" strokeWidth="1.5"/>
              <path d="M10 6V10M10 14H10.01" stroke="#FF9500" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            What went badly or needs attention?
          </label>
          <textarea
            value={feedback.bad}
            onChange={(e) => handleFeedbackChange('bad', e.target.value)}
            rows="3"
            required
            className="feedback-textarea"
            placeholder="Describe any issues or challenges..."
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="label-icon">
              <path d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M10 6L14 2L18 6M14 2V10" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Any suggestions or additional notes?
          </label>
          <textarea
            value={feedback.suggestions}
            onChange={(e) => handleFeedbackChange('suggestions', e.target.value)}
            rows="3"
            required
            className="feedback-textarea"
            placeholder="Share your ideas for improvement..."
          />
        </div>

        <button 
          type="submit" 
          className="submit-checkout-button"
          disabled={loading || !feedback.good || !feedback.bad || !feedback.suggestions}
        >
          {loading ? (
            <span className="loading-spinner"></span>
          ) : (
            'Complete Check Out'
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckOutForm;