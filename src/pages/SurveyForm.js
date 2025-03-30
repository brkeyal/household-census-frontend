import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHousehold, submitSurvey } from '../services/api';

const SurveyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [household, setHousehold] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    focalPoint: '',
    focalPointImage: null,
    familyMembers: [{ firstName: '', lastName: '', birthDate: '' }],
    carCount: 0,
    hasPets: 'no',
    petCount: 0,
    housingType: '',
    environmentalPractices: []
  });

  // Mock housing options
  const housingOptions = [
    'Apartment', 
    'House', 
    'Condominium', 
    'Duplex', 
    'Mobile home', 
    'Other'
  ];

  // Mock environmental practices
  const environmentalPractices = [
    'Recycling',
    'Composting food scraps',
    'Conserving water',
    'Reducing plastic use',
    'Using reusable shopping bags',
    'Participating in local environmental initiatives'
  ];

  useEffect(() => {
    const fetchHousehold = async () => {
      try {
        // For now, use mock data until backend is ready
        // const data = await getHousehold(id);
        const mockData = {
          id,
          familyName: id === '1' ? 'Smith' : id === '2' ? 'Johnson' : 'Williams',
          address: id === '1' ? '123 Main St, Anytown, USA' : 
                   id === '2' ? '456 Oak Ave, Somewhere, USA' : 
                   '789 Pine Rd, Nowhere, USA',
          status: id === '2' ? 'completed' : 'pending',
          dateSurveyed: id === '2' ? '2025-03-15' : null
        };
        
        setHousehold(mockData);
        
        // If survey is already completed, pre-fill the form
        if (mockData.status === 'completed') {
          setFormData({
            focalPoint: 'John',
            focalPointImage: null,
            familyMembers: [
              { firstName: 'John', lastName: 'Johnson', birthDate: '1980-05-15' },
              { firstName: 'Jane', lastName: 'Johnson', birthDate: '1982-09-22' }
            ],
            carCount: 2,
            hasPets: 'yes',
            petCount: 1,
            housingType: 'House',
            environmentalPractices: ['Recycling', 'Conserving water']
          });
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch household data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchHousehold();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'hasPets') {
      setFormData(prev => ({
        ...prev,
        hasPets: value,
        // Reset pet count to 0 if "no" is selected
        petCount: value === 'no' ? 0 : prev.petCount
      }));
    } else if (type === 'checkbox') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          environmentalPractices: [...prev.environmentalPractices, value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          environmentalPractices: prev.environmentalPractices.filter(practice => practice !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        focalPointImage: file
      }));
    }
  };

  const handleFamilyMemberChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMembers = [...formData.familyMembers];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [name]: value
    };
    
    setFormData(prev => ({
      ...prev,
      familyMembers: updatedMembers
    }));
  };

  const addFamilyMember = () => {
    setFormData(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, { firstName: '', lastName: '', birthDate: '' }]
    }));
  };

  const removeFamilyMember = (index) => {
    if (formData.familyMembers.length > 1) {
      const updatedMembers = [...formData.familyMembers];
      updatedMembers.splice(index, 1);
      
      setFormData(prev => ({
        ...prev,
        familyMembers: updatedMembers
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // In a real app, we would send the data to the backend
      // const response = await submitSurvey(id, formData);
      
      // For now, just simulate a successful submission
      console.log('Submitted form data:', formData);
      
      // Redirect to the home page after submission
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (err) {
      setError('Failed to submit survey');
      setLoading(false);
      console.error(err);
    }
  };

  if (loading && !household) return <p>Loading survey...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!household) return <p>Household not found</p>;

  return (
    <div>
      <div className="card-header">
        <h1>Household Survey: {household.familyName}</h1>
      </div>
      
      <div className="card">
        <div className="card-body">
          <p><strong>Address:</strong> {household.address}</p>
          <p><strong>Status:</strong> {household.status}</p>
          {household.dateSurveyed && (
            <p><strong>Date Surveyed:</strong> {household.dateSurveyed}</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Family Focal Point */}
        <div className="card">
          <div className="card-header">
            <h2>Family Focal Point</h2>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="focalPoint"
                className="form-control"
                value={formData.focalPoint}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Upload Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control"
              />
              {formData.focalPointImage && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={URL.createObjectURL(formData.focalPointImage)}
                    alt="Focal point preview"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Family Members */}
        <div className="card">
          <div className="card-header">
            <h2>Family Members</h2>
          </div>
          <div className="card-body">
            {formData.familyMembers.map((member, index) => (
              <div key={index} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3>Member #{index + 1}</h3>
                  {formData.familyMembers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFamilyMember(index)}
                      className="btn"
                      style={{ backgroundColor: '#e74c3c', color: 'white' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      value={member.firstName}
                      onChange={(e) => handleFamilyMemberChange(index, e)}
                      required
                    />
                  </div>
                  
                  <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      value={member.lastName}
                      onChange={(e) => handleFamilyMemberChange(index, e)}
                      required
                    />
                  </div>
                  
                  <div className="form-group" style={{ flex: '1', minWidth: '200px' }}>
                    <label className="form-label">Birth Date</label>
                    <input
                      type="date"
                      name="birthDate"
                      className="form-control"
                      value={member.birthDate}
                      onChange={(e) => handleFamilyMemberChange(index, e)}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addFamilyMember}
              className="btn btn-primary"
            >
              Add Family Member
            </button>
          </div>
        </div>
        
        {/* Cars and Pets */}
        <div className="card">
          <div className="card-header">
            <h2>Transportation & Pets</h2>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">How many cars do they own?</label>
              <input
                type="number"
                name="carCount"
                className="form-control"
                min="0"
                value={formData.carCount}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Do they have any pets?</label>
              <div>
                <label style={{ marginRight: '20px' }}>
                  <input
                    type="radio"
                    name="hasPets"
                    value="yes"
                    checked={formData.hasPets === 'yes'}
                    onChange={handleInputChange}
                    style={{ marginRight: '5px' }}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="hasPets"
                    value="no"
                    checked={formData.hasPets === 'no'}
                    onChange={handleInputChange}
                    style={{ marginRight: '5px' }}
                  />
                  No
                </label>
              </div>
            </div>
            
            {formData.hasPets === 'yes' && (
              <div className="form-group">
                <label className="form-label">How many pets?</label>
                <input
                  type="number"
                  name="petCount"
                  className="form-control"
                  min="1"
                  value={formData.petCount}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Housing Type */}
        <div className="card">
          <div className="card-header">
            <h2>Housing Information</h2>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">What type of housing is it?</label>
              <select
                name="housingType"
                className="form-control"
                value={formData.housingType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select housing type</option>
                {housingOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Environmental Practices */}
        <div className="card">
          <div className="card-header">
            <h2>Environmental Practices</h2>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">
                Which of these environmentally friendly practices does your household engage in regularly?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '10px' }}>
                {environmentalPractices.map(practice => (
                  <label key={practice} style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      name="environmentalPractices"
                      value={practice}
                      checked={formData.environmentalPractices.includes(practice)}
                      onChange={handleInputChange}
                      style={{ marginRight: '10px' }}
                    />
                    {practice}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div style={{ marginTop: '20px', marginBottom: '40px' }}>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Survey'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SurveyForm;