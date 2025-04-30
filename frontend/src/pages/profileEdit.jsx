import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import PlatformName from "../components/PlatformName"; // Import the PlatformName component
import "./profileEdit.css";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    county: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch current user data
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API call
        const response = await fetch("/api/user/profile");
        const data = await response.json();

        if (data.success) {
          setFormData({
            firstName: data.user.firstName || "",
            lastName: data.user.lastName || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            county: data.user.county || "",
            password: "",
            confirmPassword: "",
          });
        }
      } catch (err) {
        setError("Failed to load user data");
      } finally {
        setIsLoading(false);
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const dataToSend = { ...formData };
      if (!dataToSend.password) {
        delete dataToSend.password;
        delete dataToSend.confirmPassword;
      }

      // Replace with actual API call
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (data.success) {
        navigate("/profile");
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred while updating your profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  if (isLoading) {
    return <div className="profile-edit-loading">Loading...</div>;
  }

  return (
    <div className="profile-edit-container">
      <PlatformName /> 

      {error && <div className="profile-edit-error">{error}</div>}
      <h1 className="profile-edit-title">Edit Profile</h1>


      <form onSubmit={handleSubmit} className="profile-edit-form">
        <div className="profile-edit-field-group">
          <InputField
            label="First Name"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />

          <InputField
            label="Last Name"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="profile-edit-field-group">
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <InputField
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div className="profile-edit-field-group">
          <div className="profile-edit-field-group">
            <label htmlFor="county" className="profile-edit-label">
              County
            </label>
            <select
              id="county"
              name="county"
              value={formData.county}
              onChange={handleInputChange}
              className="profile-edit-select"
            >
              <option value="">Select County</option>
              <option value="Baringo">Baringo</option>
              <option value="Bomet">Bomet</option>
              <option value="Bungoma">Bungoma</option>
              <option value="Busia">Busia</option>
              <option value="Elgeyo Marakwet">Elgeyo Marakwet</option>
              <option value="Embu">Embu</option>
              <option value="Garissa">Garissa</option>
              <option value="Homa Bay">Homa Bay</option>
              <option value="Isiolo">Isiolo</option>
              <option value="Kajiado">Kajiado</option>
              <option value="Kakamega">Kakamega</option>
              <option value="Kericho">Kericho</option>
              <option value="Kiambu">Kiambu</option>
              <option value="Kilifi">Kilifi</option>
              <option value="Kirinyaga">Kirinyaga</option>
              <option value="Kisii">Kisii</option>
              <option value="Kisumu">Kisumu</option>
              <option value="Kitui">Kitui</option>
              <option value="Kwale">Kwale</option>
              <option value="Laikipia">Laikipia</option>
              <option value="Lamu">Lamu</option>
              <option value="Machakos">Machakos</option>
              <option value="Makueni">Makueni</option>
              <option value="Mandera">Mandera</option>
              <option value="Marsabit">Marsabit</option>
              <option value="Meru">Meru</option>
              <option value="Migori">Migori</option>
              <option value="Mombasa">Mombasa</option>
              <option value="Murang'a">Murang'a</option>
              <option value="Nairobi">Nairobi</option>
              <option value="Nakuru">Nakuru</option>
              <option value="Nandi">Nandi</option>
              <option value="Narok">Narok</option>
              <option value="Nyamira">Nyamira</option>
              <option value="Nyandarua">Nyandarua</option>
              <option value="Nyeri">Nyeri</option>
              <option value="Samburu">Samburu</option>
              <option value="Siaya">Siaya</option>
              <option value="Taita Taveta">Taita Taveta</option>
              <option value="Tana River">Tana River</option>
              <option value="Tharaka Nithi">Tharaka Nithi</option>
              <option value="Trans Nzoia">Trans Nzoia</option>
              <option value="Turkana">Turkana</option>
              <option value="Uasin Gishu">Uasin Gishu</option>
              <option value="Vihiga">Vihiga</option>
              <option value="Wajir">Wajir</option>
              <option value="West Pokot">West Pokot</option>
            </select>
          </div>
        </div>

        <div className="profile-edit-field-group">
          <InputField
            label="New Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Leave blank to keep current password"
          />

          <InputField
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm new password"
          />
        </div>

        <div className="profile-edit-buttons">
          <button
            type="button"
            onClick={handleCancel}
            className="profile-edit-button cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="profile-edit-button save"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
