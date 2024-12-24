import React from 'react';

const LandingPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome To Panchantantra!</h1>
      <h4>Please Choose an Option:</h4>
      <div style={{ marginTop: '30px' }}>
        <button
          onClick={() => (window.location.href = '/classes')} // Updated to navigate to Classes
          style={{ margin: '10px', padding: '10px 20px' }}
        >
          Classes
        </button>
        <button
          onClick={() => (window.location.href = '/teachers')}
          style={{ margin: '10px', padding: '10px 20px' }}
        >
          Teachers
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
