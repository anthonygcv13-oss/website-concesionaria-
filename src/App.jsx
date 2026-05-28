import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Models from './pages/Models';
import Services from './pages/Services';
import Quote from './pages/Quote';

// Helper component to reset scroll position on page change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modelos" element={<Models />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/cotizar" element={<Quote />} />
      </Routes>
    </Router>
  );
}
