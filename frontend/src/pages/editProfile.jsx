import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileIcon from "../components/ProfileIcon";
import InputField from "../components/InputField";

import "./editProfile.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch current user data
    const fetchUserData = async () => {
      try {
        // TODO: Replace with actual API call
        const userData = {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "1234567890",
        };
        setFormData(userData);
      } catch (err) {
        setError("Failed to load user data");
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate("/user");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = () => {
    const first = formData.firstName.charAt(0);
    const last = formData.lastName.charAt(0);
    return `${first}${last}`.toUpperCase();
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-header">
        <h1>Edit Profile</h1>
        <ProfileIcon initials={getInitials()} />
      </div>

      <form onSubmit={handleSubmit} className="edit-profile-form">
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <InputField
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <InputField
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <InputField
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className="button-group">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/user")}
          >
            Cancel
          </button>
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
