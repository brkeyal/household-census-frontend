import React, { useState } from 'react';
import { createHousehold } from '../services/api';

const ImportHouseholds = ({ onImportComplete }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid JSON file');
    }
  };

  const processImport = async () => {
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);
      setResults(null);

      // Read the file
      const fileContent = await file.text();
      let householdData;

      try {
        householdData = JSON.parse(fileContent);
      } catch (e) {
        throw new Error('Invalid JSON format');
      }

      // Validate the data structure
      if (!Array.isArray(householdData)) {
        throw new Error('JSON must contain an array of households');
      }

      // Process each household
      const results = {
        success: 0,
        failed: 0,
        errors: []
      };

      for (const household of householdData) {
        // Validate required fields
        if (!household.familyName || !household.address) {
          results.failed++;
          results.errors.push(`Missing required fields for household: ${JSON.stringify(household)}`);
          continue;
        }

        try {
          // Create the household in the database
          await createHousehold({
            familyName: household.familyName,
            address: household.address
          });
          results.success++;
        } catch (error) {
          results.failed++;
          results.errors.push(`Failed to create household ${household.familyName}: ${error.message}`);
        }
      }

      setResults(results);
      
      // Notify parent component to refresh the household list
      if (results.success > 0 && onImportComplete) {
        onImportComplete();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Sample JSON template
  const sampleData = [
    { "familyName": "Smith", "address": "123 Main St, Springfield, IL" },
    { "familyName": "Johnson", "address": "456 Oak Ave, Franklin, CA" }
  ];

  const handleDownloadSample = () => {
    const dataStr = JSON.stringify(sampleData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-households.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center flex-wrap">
        <h2>Import Households</h2>
        <button 
          type="button" 
          className="btn" 
          style={{ backgroundColor: '#3498db', color: 'white' }}
          onClick={handleDownloadSample}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download Sample JSON
        </button>
      </div>
      <div className="card-body">
        <p>Upload a JSON file with household data to quickly add multiple households.</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
          Not sure about the format? Use the "Download Sample JSON" button above to get a template.
        </p>
        
        <div className="form-group">
          <label className="form-label">JSON File</label>
          <input 
            type="file" 
            accept=".json,application/json" 
            onChange={handleFileChange} 
            className="form-control"
            disabled={isLoading}
          />
        </div>
        
        {error && (
          <div style={{ color: '#e74c3c', margin: '15px 0', padding: '10px', backgroundColor: '#fadbd8', borderRadius: '4px' }}>
            Error: {error}
          </div>
        )}
        
        {file && (
          <div style={{ marginTop: '20px' }}>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={processImport}
              disabled={isLoading}
            >
              {isLoading ? 'Importing...' : 'Import Households'}
            </button>
          </div>
        )}
        
        {results && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <h3>Import Results</h3>
            <p>Successfully imported: {results.success} households</p>
            {results.failed > 0 && (
              <>
                <p>Failed to import: {results.failed} households</p>
                <details>
                  <summary>View Errors</summary>
                  <ul style={{ marginTop: '10px' }}>
                    {results.errors.map((err, index) => (
                      <li key={index} style={{ color: '#e74c3c' }}>{err}</li>
                    ))}
                  </ul>
                </details>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportHouseholds;