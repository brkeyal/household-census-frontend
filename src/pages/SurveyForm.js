import React from "react";
import { useParams } from "react-router-dom";

const SurveyForm = () => {
  const { id } = useParams();
  
  return (
    <div>
      <h1>Survey Form</h1>
      <p>This page will display the survey form for household ID: {id}</p>
    </div>
  );
};

export default SurveyForm;

