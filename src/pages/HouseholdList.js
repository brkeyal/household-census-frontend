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
        // For now, we'll use mock data until the backend is ready
        // const data = await getHouseholds();
        const mockData = [
          {
            id: '1',
            familyName: 'Smith',
            address: '123 Main St, Anytown, USA',
            status: 'pending',
            dateSurveyed: null
          },
          {
            id: '2',
            familyName: 'Johnson',
            address: '456 Oak Ave, Somewhere, USA',
            status: 'completed',
            dateSurveyed: '2025-03-15'
          },
          {
            id: '3',
            familyName: 'Williams',
            address: '789 Pine Rd, Nowhere, USA',
            status: 'pending',
            dateSurveyed: null
          }
        ];
        
        setHouseholds(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch households');
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
          <div key={household.id} className="card">
            <div className="card-header">
              <h2>{household.familyName}</h2>
              <span className={`badge badge-${household.status}`}>
                {household.status.charAt(0).toUpperCase() + household.status.slice(1)}
              </span>
            </div>
            <div className="card-body">
              <p><strong>Address:</strong> {household.address}</p>
              {household.dateSurveyed && (
                <p><strong>Date Surveyed:</strong> {household.dateSurveyed}</p>
              )}
              <Link to={`/survey/${household.id}`} className="btn btn-primary">
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