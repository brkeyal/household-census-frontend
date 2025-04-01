import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHouseholds } from '../services/api';
import ImportHouseholds from '../components/ImportHouseholds';

const HouseholdList = () => {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImport, setShowImport] = useState(false);

  const fetchHouseholds = async () => {
    try {
      setLoading(true);
      // Actually fetch data from the backend API
      const data = await getHouseholds();
      setHouseholds(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch households: ' + err.message);
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const handleImportComplete = () => {
    // Refresh the household list after import
    fetchHouseholds();
    // Hide the import section
    setShowImport(false);
  };

  if (loading) return <p>Loading households...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Household List</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowImport(!showImport)}
        >
          {showImport ? 'Hide Import' : 'Import Households'}
        </button>
      </div>
      
      {showImport && (
        <ImportHouseholds onImportComplete={handleImportComplete} />
      )}
      
      {households.length === 0 ? (
        <div className="card">
          <div className="card-body">
            <p>No households found. Use the Import button above to add households.</p>
          </div>
        </div>
      ) : (
        households.map(household => (
          <div key={household._id} className="card">
            <div className="card-header">
              <h2>{household.familyName}</h2>
              <span className={`badge badge-${household.status}`}>
                {household.status.charAt(0).toUpperCase() + household.status.slice(1)}
              </span>
            </div>
            <div className="card-body">
              <p><strong>Address:</strong> {household.address}</p>
              {household.dateSurveyed && (
                <p><strong>Date Surveyed:</strong> {new Date(household.dateSurveyed).toLocaleDateString()}</p>
              )}
              <Link to={`/survey/${household._id}`} className="btn btn-primary">
                {household.status === 'completed' ? 'View Survey' : 'Start Survey'}
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default HouseholdList;