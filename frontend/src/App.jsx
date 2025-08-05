import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WebcamCapture from './components/WebcamCapture';
import Header from './components/Header';
import TimeDate from './components/TimeDate';
import Reports from './components/Reports'; // Add the Reports component here
import CategoryManagement from './components/Category';
import WebcamGallery from './components/UploadedBills';
import './App.css';

const App = () => {
  return (
    <Router>
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <div className='sticky-header'>
          <Header />
        </div>
        <Routes>
          {/* Define Routes here */}
          <Route path="/upload" element={<WebcamCapture />} />
          <Route path="/" element={<WebcamCapture />} />

          {/* <Route path="/reports" element={<Reports />} />  */}
          <Route path="/category" element={<CategoryManagement />} /> {/* New route for reports */}
          <Route path="/bills" element={<WebcamGallery />} /> {/* New route for reports */}


        </Routes>
      </div>
    </Router>
  );
}

export default App;
