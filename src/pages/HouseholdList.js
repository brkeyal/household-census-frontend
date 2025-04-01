import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHouseholds } from '../services/api';

const HouseholdList = () => {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchHouseholds();
  }, []);

  if (loading) return <p>Loading households...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="card-header">
        <h1>Household List</h1>
      </div>
      
      {households.length === 0 ? (
        <p>No households found.</p>
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