import React, { useState, useEffect } from 'react';
import '../App.css';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return (
    <div>
      <span className="date"> {time.toLocaleDateString(undefined, options)} </span>
      <br></br>
      
      <span className="clock"> {time.toLocaleTimeString()}</span>
      
    </div>
  );
}

export default Clock;