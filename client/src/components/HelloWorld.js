import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HelloWorld = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on user role
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (user.role === 'employee') {
        navigate('/employee-dashboard');
      }
    }
  }, [user, navigate]);

  return (
    <div className="hello-container">
      <h1>Redirecting...</h1>
    </div>
  );
};

export default HelloWorld;