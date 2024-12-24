import React from 'react';
import './LandingPage.css'; // Import the CSS file

const LandingPage = () => {
  return (
    <div className="landing-container">
      
      {/* Header Section */}
      <header className="header">
        <h1>Welcome to Panchantantra!</h1>
        <h4>Your Gateway to Knowledge</h4>
        <div className="landing-buttons">
          <button onClick={() => (window.location.href = '/classes')}>Classes</button>
          <button onClick={() => (window.location.href = '/teachers')}>Teachers</button>
        </div>
      </header>

      {/* Body Section with School Image */}
      <div className="body">
        <img src={require('../../assets/images/background.jpg')} alt="School" className="school-image" />
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <p>Address: Panchantantra School, 123 Education Street, Cityville</p>
      </footer>
    </div>
  );
};

export default LandingPage;
