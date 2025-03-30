import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import page components (we'll create these next)
import HouseholdList from './pages/HouseholdList';
import SurveyForm from './pages/SurveyForm';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<HouseholdList />} />
            <Route path="/survey/:id" element={<SurveyForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;