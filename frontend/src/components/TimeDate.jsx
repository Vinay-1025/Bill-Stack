import React, { useState, useEffect } from 'react';
import './TimeDate.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const TimeDate = () => {
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate(); // Initialize useNavigate

  // Optional: update time every second if needed
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const handleIconClick = () => {
    navigate('/reports'); // Navigate to the /reports route
  };

  return (
    <div className='date-time'>
      <div><b>Date :</b> {time.toLocaleDateString()}</div>
      <div><b>Time :</b> {time.toLocaleTimeString()} </div>
    </div>
  );
};

export default TimeDate;
