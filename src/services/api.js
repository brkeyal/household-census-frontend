import axios from 'axios';

// API base URL - using port 5001 to match docker-compose external port
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
console.log("EYALBTEST00 API_URL=", API_URL);

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Household endpoints
export const getHouseholds = async () => {
  try {
    console.log("EYALBTEST in getHouseholds");
    console.log("api=", api);
    console.log(`EYALBTEST API_URL= ${API_URL}`);

    const response = await api.get('/households');
    return response.data;
  } catch (error) {
    console.error('Error fetching households:', error);
    throw error;
  }
};

export const getHousehold = async (id) => {
  try {
    const response = await api.get(`/households/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching household ${id}:`, error);
    throw error;
  }
};

export const createHousehold = async (householdData) => {
  try {
    const response = await api.post('/households', householdData);
    return response.data;
  } catch (error) {
    console.error('Error creating household:', error);
    throw error;
  }
};

export const updateHousehold = async (id, householdData) => {
  try {
    const response = await api.put(`/households/${id}`, householdData);
    return response.data;
  } catch (error) {
    console.error(`Error updating household ${id}:`, error);
    throw error;
  }
};

// Survey endpoints
export const submitSurvey = async (id, surveyData) => {
  try {
    console.log("EYALBTEST in submitSurvey");
    console.log("api=", api);
    console.log(`EYALBTEST API_URL= ${API_URL}`);

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
  } catch (error) {
    console.error(`Error submitting survey for household ${id}:`, error);
    throw error;
  }
};

export default api;