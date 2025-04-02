import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getHouseholds } from "../services/api";
import ImportHouseholds from "../components/ImportHouseholds";

const HouseholdList = () => {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchHouseholds = async () => {
    try {
      setLoading(true);
      const data = await getHouseholds();
      setHouseholds(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch households: " + err.message);
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const handleImportComplete = () => {
    fetchHouseholds();
    setShowImport(false);
  };

  // Filter and search functionality
  const filteredHouseholds = households.filter((household) => {
    const matchesSearch =
      household.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || household.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Stats calculation
  const totalHouseholds = households.length;
  const completedSurveys = households.filter(
    (h) => h.status === "completed"
  ).length;
  const pendingSurveys = households.filter(
    (h) => h.status === "pending"
  ).length;
  const completionRate =
    totalHouseholds > 0
      ? Math.round((completedSurveys / totalHouseholds) * 100)
      : 0;

  if (loading) {
    return (
      <div
        className="loading-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "200px",
        }}
      >
        <div className="loading-spinner"></div>
        <p style={{ marginLeft: "12px" }}>Loading households...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="error-container"
        style={{
          backgroundColor: "#FFEBEE",
          color: "#C62828",
          padding: "16px",
          borderRadius: "8px",
          margin: "20px 0",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0" }}>Error</h3>
        <p>{error}</p>
        <button
          onClick={fetchHouseholds}
          className="btn"
          style={{
            backgroundColor: "#C62828",
            color: "white",
            marginTop: "10px",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Dashboard Summary Stats */}
      <div
        className="dashboard-stats"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <div
          className="stat-card"
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            padding: "15px",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              color: "var(--text-light)",
              fontSize: "0.85rem",
              margin: "0 0 5px 0",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Total
          </h3>
          <p
            style={{
              fontSize: "1.8rem",
              fontWeight: "600",
              margin: "0",
              color: "var(--primary-color)",
            }}
          >
            {totalHouseholds}
          </p>
        </div>

        <div
          className="stat-card"
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            padding: "15px",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              color: "var(--text-light)",
              fontSize: "0.85rem",
              margin: "0 0 5px 0",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Completed
          </h3>
          <p
            style={{
              fontSize: "1.8rem",
              fontWeight: "600",
              margin: "0",
              color: "var(--success-color)",
            }}
          >
            {completedSurveys}
          </p>
        </div>

        <div
          className="stat-card"
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            padding: "15px",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              color: "var(--text-light)",
              fontSize: "0.85rem",
              margin: "0 0 5px 0",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Pending
          </h3>
          <p
            style={{
              fontSize: "1.8rem",
              fontWeight: "600",
              margin: "0",
              color: "var(--warning-color)",
            }}
          >
            {pendingSurveys}
          </p>
        </div>

        <div
          className="stat-card"
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            padding: "15px",
            textAlign: "center",
            position: "relative",
          }}
        >
          <h3
            style={{
              color: "var(--text-light)",
              fontSize: "0.85rem",
              margin: "0 0 5px 0",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Rate
          </h3>
          <p
            style={{
              fontSize: "1.8rem",
              fontWeight: "600",
              margin: "0",
              color: "#6c5ce7",
            }}
          >
            {completionRate}%
          </p>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: `${completionRate}%`,
              height: "4px",
              backgroundColor: "#6c5ce7",
              borderRadius: "0 0 0 8px",
            }}
          ></div>
        </div>
      </div>

      {/* Header with actions */}
      <div
        className="card-header"
        style={{
          padding: "20px",
          marginBottom: "20px",
          borderRadius: "8px",
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>
            Household Management
          </h1>
          <button
            className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
            onClick={() => setShowImport(!showImport)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            {showImport ? "Hide Import" : "Import Households"}
          </button>
        </div>
      </div>

      {showImport && (
        <ImportHouseholds onImportComplete={handleImportComplete} />
      )}

      {/* Search and filters */}
      <div className="filters-container" style={{ 
  display: 'flex', 
  gap: '80px', 
  marginBottom: '20px',
  alignItems: 'center',
  flexWrap: 'wrap'
}}>
  <div style={{ position: 'relative', flex: '1' }}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}>
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    <input 
      type="text" 
      placeholder="Search by family name or address..." 
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="form-control"
      style={{ paddingLeft: '40px' }}
    />
  </div>
  
  <div>
    <select 
      value={filterStatus} 
      onChange={(e) => setFilterStatus(e.target.value)}
      className="form-control"
      style={{ minWidth: '150px' }}
    >
      <option value="all">All Status</option>
      <option value="pending">Pending</option>
      <option value="completed">Completed</option>
    </select>
  </div>
</div>

      {/* Households table */}
      {filteredHouseholds.length === 0 ? (
  <div className="card" style={{ textAlign: 'center', padding: '30px 20px' }}>
    <div className="card-body">
      {searchTerm || filterStatus !== 'all' ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-light)', margin: '0 auto 15px auto' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <h3>No matching households found</h3>
          <p>Try adjusting your search criteria or filters</p>
          <button 
            className="btn btn-primary" 
            onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
            style={{ marginTop: '10px' }}
          >
            Clear Filters
          </button>
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-light)', margin: '0 auto 15px auto' }}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <h3>No households found</h3>
          <p>Use the Import button above to add households</p>
        </>
      )}
    </div>
  </div>
) : (
  <div className="card">
    <div style={{ overflowX: 'auto' }}>
      <table className="table table-hover" style={{ margin: 0 }}>
        <thead>
          <tr>
            <th style={{ padding: '16px 20px' }}>Family Name</th>
            <th style={{ padding: '16px 20px' }}>Address</th>
            <th style={{ padding: '16px 20px', width: '140px' }}>Status</th>
            <th style={{ padding: '16px 20px', width: '150px' }}>Date Surveyed</th>
            <th style={{ padding: '16px 20px', width: '100px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredHouseholds.map(household => (
            <tr key={household._id}>
              <td style={{ padding: '14px 20px', fontWeight: '500' }}>{household.familyName}</td>
              <td style={{ padding: '14px 20px' }}>{household.address}</td>
              <td style={{ padding: '14px 20px' }}>
                <span className={`badge badge-${household.status}`}>
                  {household.status === 'completed' ? 'Completed' : 'Pending'}
                </span>
              </td>
              <td style={{ padding: '14px 20px' }}>
                {household.dateSurveyed 
                  ? new Date(household.dateSurveyed).toLocaleDateString() 
                  : '—'}
              </td>
              <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                <Link 
                  to={`/survey/${household._id}`} 
                  className="btn btn-primary"
                  style={{ 
                    padding: '6px 12px', 
                    fontSize: '0.9rem',
                    minWidth: '80px',
                    textDecoration: 'none'
                  }}
                >
                  {household.status === 'completed' ? 'View' : 'Start'}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

      {/* Pagination placeholder - can be implemented with actual data */}
      {filteredHouseholds.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ color: "var(--text-light)", fontSize: "0.9rem" }}>
            Showing {filteredHouseholds.length} of {households.length}{" "}
            households
          </span>
        </div>
      )}
    </div>
  );
};

export default HouseholdList;
