import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HouseholdList from './pages/HouseholdList';
import SurveyForm from './pages/SurveyForm';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HouseholdList />} />
          <Route path="/survey/:id" element={<SurveyForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;