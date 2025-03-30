import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
});

export const getHouseholds = async () => {
  const response = await api.get("/households");
  return response.data;
};

export const getHousehold = async (id) => {
  const response = await api.get(`/households/${id}`);
  return response.data;
};

export const submitSurvey = async (id, surveyData) => {
  const response = await api.post(`/households/${id}/survey`, surveyData);
  return response.data;
};

export default api;

