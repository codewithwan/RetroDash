import { useState, useEffect } from 'react';

function Header() {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dateString = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      });
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false
      });
      
      setCurrentDate(dateString);
      setCurrentTime(timeString);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header">
      <h1 className="title">RETRODASH v1.0</h1>
      <div className="system-info">
        <span id="current-date">{currentDate}</span> | <span id="current-time">{currentTime}</span>
      </div>
    </header>
  );
}

export default Header;
