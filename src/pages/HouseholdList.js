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
        <div className="card">
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-responsive">
              <table className="table table-hover" style={{ margin: 0 }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px 15px' }}>Family Name</th>
                    <th style={{ padding: '12px 15px' }}>Address</th>
                    <th style={{ padding: '12px 15px', width: '130px' }}>Status</th>
                    <th style={{ padding: '12px 15px', width: '150px' }}>Date Surveyed</th>
                    <th style={{ padding: '12px 15px', width: '120px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {households.map(household => (
                    <tr key={household._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px 15px', fontWeight: '500' }}>{household.familyName}</td>
                      <td style={{ padding: '10px 15px' }}>{household.address}</td>
                      <td style={{ padding: '10px 15px' }}>
                        <span className={`badge badge-${household.status}`} style={{ display: 'inline-block', width: '100px', textAlign: 'center' }}>
                          {household.status.charAt(0).toUpperCase() + household.status.slice(1)}
                        </span>
                      </td>
                      <td style={{ padding: '10px 15px' }}>
                        {household.dateSurveyed 
                          ? new Date(household.dateSurveyed).toLocaleDateString() 
                          : '-'}
                      </td>
                      <td style={{ padding: '10px 15px' }}>
                        <Link to={`/survey/${household._id}`} className="btn btn-primary" style={{ padding: '5px 12px', fontSize: '0.9rem' }}>
                          {household.status === 'completed' ? 'View' : 'Start'}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseholdList;