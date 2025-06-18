import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import EditorPage from './components/EditorPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor/:language" element={<EditorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;