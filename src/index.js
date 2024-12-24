import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/LoginComponent/Login';

import LandingPage from './components/LandingComponent/LandingPage';
import Students from './components/Students';
import Teachers from './components/Teachers';
import Classes from './components/ClassComponent/Classes';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/landingPage" element={<LandingPage />} />
      <Route path='/students' element={<Students/>}></Route>
      <Route path="/teachers" element={<Teachers />} />
      <Route path="/classes" element={<Classes />} /> {/* New Route */}
    </Routes>
  </Router>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
