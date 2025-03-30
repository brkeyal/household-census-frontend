import axios from 'axios';

// API base URL - updated to use port 5001 in development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Household endpoints
export const getHouseholds = async () => {
  const response = await api.get('/households');
  return response.data;
};

export const getHousehold = async (id) => {
  const response = await api.get(`/households/${id}`);
  return response.data;
};

export const createHousehold = async (householdData) => {
  const response = await api.post('/households', householdData);
  return response.data;
};

export const updateHousehold = async (id, householdData) => {
  const response = await api.put(`/households/${id}`, householdData);
  return response.data;
};

// Survey endpoints
export const submitSurvey = async (id, surveyData) => {
  // For file uploads (like images), we need to use FormData
  let formData;
  
  if (surveyData.focalPointImage) {
    formData = new FormData();
    
    // Append all non-file data
    Object.keys(surveyData).forEach(key => {
      if (key !== 'focalPointImage' && key !== 'familyMembers' && key !== 'environmentalPractices') {
        formData.append(key, surveyData[key]);
      }
    });
    
    // Append the file
    formData.append('focalPointImage', surveyData.focalPointImage);
    
    // Append array data
    formData.append('familyMembers', JSON.stringify(surveyData.familyMembers));
    formData.append('environmentalPractices', JSON.stringify(surveyData.environmentalPractices));
    
    // Use different headers for multipart/form-data
    const response = await api.post(`/households/${id}/survey`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } else {
    // If no file upload, use regular JSON
    const response = await api.post(`/households/${id}/survey`, surveyData);
    return response.data;
  }
};

export default api;