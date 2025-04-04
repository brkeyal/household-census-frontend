import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHousehold, submitSurvey } from "../services/api";

const SurveyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [household, setHousehold] = useState(null);
  const [viewMode, setViewMode] = useState(false);

  // Define baseUrl
  const baseUrl = process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL.replace("/api", "")
    : "http://localhost:5001";

  // Form state
  const [formData, setFormData] = useState({
    focalPoint: "",
    focalPointImage: null,
    familyMembers: [{ firstName: "", lastName: "", birthDate: "" }],
    carCount: 0,
    hasPets: "no",
    petCount: 0,
    housingType: "",
    environmentalPractices: [],
  });

  // Housing options
  const housingOptions = [
    "Apartment",
    "House",
    "Condominium",
    "Duplex",
    "Mobile home",
    "Other",
  ];

  // Environmental practices
  const environmentalPractices = [
    "Recycling",
    "Composting food scraps",
    "Conserving water",
    "Reducing plastic use",
    "Using reusable shopping bags",
    "Participating in local environmental initiatives",
  ];

  useEffect(() => {
    const fetchHousehold = async () => {
      try {
        setLoading(true);
        const data = await getHousehold(id);
        setHousehold(data);

        // If survey is already completed, pre-fill the form and set view mode
        if (data.status === "completed" && data.survey) {
          setViewMode(true);

          // Convert database data format to form format
          const survey = data.survey;
          setFormData({
            focalPoint: survey.focalPoint || "",
            focalPointImage: null, // We can't populate file input
            familyMembers:
              survey.familyMembers.length > 0
                ? survey.familyMembers.map((member) => ({
                    firstName: member.firstName,
                    lastName: member.lastName,
                    birthDate: new Date(member.birthDate)
                      .toISOString()
                      .split("T")[0],
                  }))
                : [{ firstName: "", lastName: "", birthDate: "" }],
            carCount: survey.carCount || 0,
            hasPets: survey.hasPets ? "yes" : "no",
            petCount: survey.petCount || 0,
            housingType: survey.housingType || "",
            environmentalPractices: survey.environmentalPractices || [],
          });
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch household data: " + err.message);
        setLoading(false);
        console.error(err);
      }
    };

    fetchHousehold();
  }, [id]);

  const handleInputChange = (e) => {
    if (viewMode) return; // Prevent changes in view mode

    const { name, value, type, checked } = e.target;

    if (name === "hasPets") {
      setFormData((prev) => ({
        ...prev,
        hasPets: value,
        // Reset pet count to 0 if "no" is selected
        petCount: value === "no" ? 0 : prev.petCount,
      }));
    } else if (type === "checkbox") {
      if (checked) {
        setFormData((prev) => ({
          ...prev,
          environmentalPractices: [...prev.environmentalPractices, value],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          environmentalPractices: prev.environmentalPractices.filter(
            (practice) => practice !== value
          ),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    if (viewMode) return; // Prevent changes in view mode

    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        focalPointImage: file,
      }));
    }
  };

  const handleFamilyMemberChange = (index, e) => {
    if (viewMode) return; // Prevent changes in view mode

    const { name, value } = e.target;
    const updatedMembers = [...formData.familyMembers];
    updatedMembers[index] = {
      ...updatedMembers[index],
      [name]: value,
    };

    setFormData((prev) => ({
      ...prev,
      familyMembers: updatedMembers,
    }));
  };

  const addFamilyMember = () => {
    if (viewMode) return; // Prevent changes in view mode

    setFormData((prev) => ({
      ...prev,
      familyMembers: [
        ...prev.familyMembers,
        { firstName: "", lastName: "", birthDate: "" },
      ],
    }));
  };

  const removeFamilyMember = (index) => {
    if (viewMode) return; // Prevent changes in view mode

    if (formData.familyMembers.length > 1) {
      const updatedMembers = [...formData.familyMembers];
      updatedMembers.splice(index, 1);

      setFormData((prev) => ({
        ...prev,
        familyMembers: updatedMembers,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (viewMode) {
      navigate("/");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Actually submit the data to the backend
      await submitSurvey(id, formData);

      // Redirect to the home page after submission
      navigate("/");
    } catch (err) {
      setError("Failed to submit survey: " + err.message);
      setSubmitting(false);
      console.error(err);
    }
  };

  // Toggle between edit and view mode
  const toggleEditMode = () => {
    // If switching from edit mode back to view mode, reset form data to original
    if (!viewMode) {
      // If we have survey data, refresh it from the household data
      if (household.status === "completed" && household.survey) {
        const survey = household.survey;
        setFormData({
          focalPoint: survey.focalPoint || "",
          focalPointImage: null, // We can't populate file input
          familyMembers:
            survey.familyMembers.length > 0
              ? survey.familyMembers.map((member) => ({
                  firstName: member.firstName,
                  lastName: member.lastName,
                  birthDate: new Date(member.birthDate)
                    .toISOString()
                    .split("T")[0],
                }))
              : [{ firstName: "", lastName: "", birthDate: "" }],
          carCount: survey.carCount || 0,
          hasPets: survey.hasPets ? "yes" : "no",
          petCount: survey.petCount || 0,
          housingType: survey.housingType || "",
          environmentalPractices: survey.environmentalPractices || [],
        });
      }
    }

    setViewMode(!viewMode);
  };

  if (loading && !household) return <p>Loading survey...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!household) return <p>Household not found</p>;

  if (household.survey) {
    console.log("Inside household.survey");

    if (household.survey.focalPointImage) {
      console.log(
        "Image URL:",
        `${baseUrl}${household.survey.focalPointImage}`
      );
    }
  }

  return (
    <div>
      <div
        className="card-header"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "10px",
          padding: "15px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "clamp(1.2rem, 5vw, 1.5rem)" }}>
          Household: {household.familyName}
        </h1>
        {household.status === "completed" && (
          <button
            type="button"
            className="btn"
            style={{
              backgroundColor: viewMode
                ? "var(--primary-color)"
                : "var(--danger-color)",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              alignSelf: "flex-start",
            }}
            onClick={toggleEditMode}
          >
            {viewMode ? (
              "Edit Survey"
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Cancel Editing
              </>
            )}
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-body">
          <p>
            <strong>Address:</strong> {household.address}
          </p>
          <p>
            <strong>Status:</strong> {household.status}
          </p>
          {household.dateSurveyed && (
            <p>
              <strong>Date Surveyed:</strong>{" "}
              {new Date(household.dateSurveyed).toLocaleDateString()}
            </p>
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
              {viewMode ? (
                <p>{formData.focalPoint}</p>
              ) : (
                <input
                  type="text"
                  name="focalPoint"
                  className="form-control"
                  value={formData.focalPoint}
                  onChange={handleInputChange}
                  required
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Picture</label>
              {viewMode ? (
                household.survey && household.survey.focalPointImage ? (
                  <div>
                    <img
                      src={
                        household.survey.focalPointImage.startsWith("http")
                          ? household.survey.focalPointImage
                          : `${baseUrl}${household.survey.focalPointImage}`
                      }
                      alt="Focal point"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "200px",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                ) : (
                  <p>No image provided</p>
                )
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-control"
                  />
                  {formData.focalPointImage && (
                    <div style={{ marginTop: "10px" }}>
                      <img
                        src={URL.createObjectURL(formData.focalPointImage)}
                        alt="Focal point preview"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    </div>
                  )}
                  {household.survey &&
                    household.survey.focalPointImage &&
                    !formData.focalPointImage && (
                      <div style={{ marginTop: "10px" }}>
                        <p>Current image:</p>
                        <img
                          src={
                            household.survey.focalPointImage.startsWith("http")
                              ? household.survey.focalPointImage
                              : `${baseUrl}${household.survey.focalPointImage}`
                          }
                          alt="Current focal point"
                          style={{ maxWidth: "200px", maxHeight: "200px" }}
                        />
                      </div>
                    )}
                </>
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
            {viewMode ? (
              <div>
                {formData.familyMembers.length > 0 ? (
                  <div style={{ display: "grid", gap: "15px" }}>
                    {formData.familyMembers.map((member, index) => (
                      <div
                        key={index}
                        style={{
                          padding: "15px",
                          border: "1px solid #eee",
                          borderRadius: "5px",
                        }}
                      >
                        <h3 style={{ fontSize: "1rem", marginTop: 0 }}>
                          Member #{index + 1}
                        </h3>
                        <div
                          style={{
                            display: "grid",
                            gap: "10px",
                          }}
                        >
                          <div>
                            <strong>Name:</strong> {member.firstName}{" "}
                            {member.lastName}
                          </div>
                          <div>
                            <strong>Birth Date:</strong>{" "}
                            {new Date(member.birthDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No family members listed</p>
                )}
              </div>
            ) : (
              <>
                {formData.familyMembers.map((member, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: "20px",
                      padding: "15px",
                      border: "1px solid #eee",
                      borderRadius: "5px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      <h3 style={{ margin: 0, fontSize: "1rem" }}>
                        Member #{index + 1}
                      </h3>
                      {formData.familyMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFamilyMember(index)}
                          className="btn"
                          style={{
                            backgroundColor: "#e74c3c",
                            color: "white",
                            padding: "6px 12px",
                            fontSize: "0.9rem",
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <div className="form-group" style={{ margin: 0 }}>
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

                      <div className="form-group" style={{ margin: 0 }}>
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

                      <div className="form-group" style={{ margin: 0 }}>
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
              </>
            )}
          </div>
        </div>

        {/* Cars and Pets */}
        <div className="card">
          <div className="card-header">
            <h2>Transportation & Pets</h2>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Cars owned</label>
              {viewMode ? (
                <p>{formData.carCount}</p>
              ) : (
                <input
                  type="number"
                  name="carCount"
                  className="form-control"
                  min="0"
                  value={formData.carCount}
                  onChange={handleInputChange}
                  required
                />
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Pets</label>
              {viewMode ? (
                <p>
                  {formData.hasPets === "yes"
                    ? `Yes (${formData.petCount})`
                    : "No"}
                </p>
              ) : (
                <>
                  <div>
                    <label style={{ marginRight: "20px" }}>
                      <input
                        type="radio"
                        name="hasPets"
                        value="yes"
                        checked={formData.hasPets === "yes"}
                        onChange={handleInputChange}
                        style={{ marginRight: "5px" }}
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="hasPets"
                        value="no"
                        checked={formData.hasPets === "no"}
                        onChange={handleInputChange}
                        style={{ marginRight: "5px" }}
                      />
                      No
                    </label>
                  </div>

                  {formData.hasPets === "yes" && (
                    <div className="form-group" style={{ marginTop: "10px" }}>
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
                </>
              )}
            </div>
          </div>
        </div>

        {/* Housing Type */}
        <div className="card">
          <div className="card-header">
            <h2>Housing Information</h2>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Housing Type</label>
              {viewMode ? (
                <p>{formData.housingType}</p>
              ) : (
                <select
                  name="housingType"
                  className="form-control"
                  value={formData.housingType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select housing type</option>
                  {housingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
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
                Environmental practices this household engages in regularly
              </label>
              {viewMode ? (
                formData.environmentalPractices.length > 0 ? (
                  <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                    {formData.environmentalPractices.map((practice) => (
                      <li key={practice}>{practice}</li>
                    ))}
                  </ul>
                ) : (
                  <p>None selected</p>
                )
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "10px",
                  }}
                >
                  {environmentalPractices.map((practice) => (
                    <label
                      key={practice}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "10px",
                        backgroundColor:
                          formData.environmentalPractices.includes(practice)
                            ? "rgba(67, 97, 238, 0.1)"
                            : "transparent",
                        borderRadius: "6px",
                        transition: "background-color 0.2s",
                      }}
                    >
                      <input
                        type="checkbox"
                        name="environmentalPractices"
                        value={practice}
                        checked={formData.environmentalPractices.includes(
                          practice
                        )}
                        onChange={handleInputChange}
                        style={{
                          marginRight: "10px",
                          width: "20px",
                          height: "20px",
                        }}
                      />
                      {practice}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: "20px", marginBottom: "40px" }}>
          <button
            type="submit"
            className={`btn ${viewMode ? "btn-primary" : "btn-success"}`}
            disabled={submitting}
          >
            {viewMode
              ? "Return to Dashboard"
              : submitting
              ? "Submitting..."
              : "Submit Survey"}
          </button>

          {!viewMode && (
            <button
              type="button"
              className="btn"
              style={{
                marginLeft: "10px",
                backgroundColor: "var(--danger-color)",
                color: "white",
              }}
              onClick={toggleEditMode}
            >
              Cancel Changes
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SurveyForm;
