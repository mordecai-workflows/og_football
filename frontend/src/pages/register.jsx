import "./layout.css";
import "./register.css";
import { Link } from "react-router-dom";
import { useState } from "react";

// Helper function for email validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL)



export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [preferred_foot, setPreferredFoot] = useState("");
  const [club_team, setFC] = useState("");
  const [position, setPosition] = useState("");
  const [county, setCounty] = useState("");
  const [organization, setOrganization] = useState("");
  const [experience, setExperience] = useState("");

  const counties = [
    "Mombasa",
    "Kwale",
    "Kilifi",
    "Tana River",
    "Lamu",
    "Taita‑Taveta",
    "Garissa",
    "Wajir",
    "Mandera",
    "Marsabit",
    "Isiolo",
    "Meru",
    "Tharaka‑Nithi",
    "Embu",
    "Kitui",
    "Machakos",
    "Makueni",
    "Nyandarua",
    "Nyeri",
    "Kirinyaga",
    "Murang'a",
    "Kiambu",
    "Turkana",
    "West Pokot",
    "Samburu",
    "Trans Nzoia",
    "Uasin Gishu",
    "Elgeyo‑Marakwet",
    "Nandi",
    "Baringo",
    "Laikipia",
    "Nakuru",
    "Narok",
    "Kajiado",
    "Kericho",
    "Bomet",
    "Kakamega",
    "Vihiga",
    "Bungoma",
    "Busia",
    "Siaya",
    "Kisumu",
    "Homa Bay",
    "Migori",
    "Kisii",
    "Nyamira",
    "Nairobi",
  ];

  const roles = ["Player", "Scout"];

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    dob: "",
    height: "",
    weight: "",
    preferred_foot: "",
    club_team: "",
    position: "",
    county: "",
    organization: "",
    experience: "",
  });

  const handleContinue = (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!firstName) formErrors.firstName = "First Name is required";
    if (!lastName) formErrors.lastName = "Last Name is required";
    if (!email) formErrors.email = "Email is required";
    if (email) {
      if (!isValidEmail(email)) formErrors.email = "Invalid Email Address";
    }
    if (!password) formErrors.password = "Password is required";
    if (!selectedRole) formErrors.role = "Role is required";

    if (Object.keys(formErrors).length === 0) {
      setStep(2);
      setErrors({});
    } else {
      setErrors(formErrors);
    }
  };

  const handlePrevious = (e) => {
    setStep(1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let step2Errors = {};

    if (selectedRole === "Player") {
      if (!dob) step2Errors.dob = "Date of Birth is required";
      if (!height) step2Errors.height = "Height is required";
      if (!weight) step2Errors.weight = "Weight is required";
      if (!preferred_foot)
        step2Errors.preferred_foot = "Preferred Foot is required";
      if (!club_team) step2Errors.club_team = "Football Club is required";
      if (!position) step2Errors.position = "Position is required";
      if (!county) step2Errors.county = "County is required";
    }

    if (selectedRole === "Scout") {
      if (!organization) step2Errors.organization = "Organization is required";
      if (!experience) step2Errors.experience = "Experience is required";
    }

    if (Object.keys(step2Errors).length === 0) {
      const payload = {
        firstName,
        lastName,
        email,
        password,
        role: selectedRole,
        ...(selectedRole === "Player" && {
          dob,
          height,
          weight,
          preferred_foot,
          club_team,
          position,
          county,
        }),
        ...(selectedRole === "Scout" && { organization, experience }),
      };
      console.log("Registration submitted:", payload);
      setErrors({});

      try {
        const response = await fetch(`${API_URL}/api/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log("Success:", data);
          // Optional: redirect or show success message
        } else {
          const errorData = await response.json();
          console.error("Error:", errorData);
        }
      } catch (error) {
        console.error("Network Error:", error);
      }
    } else {
      setErrors(step2Errors);
    }
  };

  return (
    <div className="main-container">
      <div className="column left">
        <h1>Get started with O.G Football</h1>
        <p>
          Answer a couple of questions and we'll get you started with your O.G
          Football account
        </p>
      </div>

      <div className="column right">
        <div className="container-form">
          <span className="container-title">Register</span>
          <form>
            <div className="register-fields">
              {step === 1 && (
                <>
                  <div
                    className={
                      errors.firstName ? "input-field error" : "input-field"
                    }
                  >
                    <label htmlFor="firstname">First Name</label>
                    <input
                      type="text"
                      id="firstname"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter First Name"
                    />
                    {errors.firstName && (
                      <small className="error-text">{errors.firstName}</small>
                    )}
                  </div>

                  <div
                    className={
                      errors.lastName ? "input-field error" : "input-field"
                    }
                  >
                    <label htmlFor="lastname">Last Name</label>
                    <input
                      type="text"
                      id="lastname"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter Last Name"
                    />
                    {errors.lastName && (
                      <small className="error-text">{errors.lastName}</small>
                    )}
                  </div>

                  <div
                    className={
                      errors.email ? "input-field error" : "input-field"
                    }
                  >
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                    {errors.email && (
                      <small className="error-text">{errors.email}</small>
                    )}
                  </div>

                  <div
                    className={
                      errors.password ? "input-field error" : "input-field"
                    }
                  >
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                    />
                    {errors.password && (
                      <small className="error-text">{errors.password}</small>
                    )}
                  </div>

                  <div
                    className={
                      errors.role ? "input-field error" : "input-field"
                    }
                  >
                    <label htmlFor="role">Role</label>
                    <select
                      id="role"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="register-select"
                    >
                      <option value="" disabled>
                        Select Role
                      </option>
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    {errors.role && (
                      <small className="error-text">{errors.role}</small>
                    )}
                  </div>
                </>
              )}

              {step === 2 && selectedRole === "Player" && (
                <>
                  <div
                    className={errors.dob ? "input-field error" : "input-field"}
                  >
                    <label htmlFor="dob">Date of Birth</label>
                    <input
                      type="date"
                      id="dob"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                    />
                    {errors.dob && (
                      <small className="error-text">{errors.dob}</small>
                    )}
                  </div>

                  <div
                    className={
                      errors.height ? "input-field error" : "input-field"
                    }
                  >
                    <label htmlFor="height">Height</label>
                    <input
                      type="text"
                      id="height"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Enter Height"
                    />
                    {errors.height && (
                      <small className="error-text">{errors.height}</small>
                    )}
                  </div>

                  <div
                    className={
                      errors.weight ? "input-field error" : "input-field"
                    }
                  >
                    <label htmlFor="weight">Weight</label>
                    <input
                      type="text"
                      id="weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="Enter Weight"
                    />
                    {errors.weight && (
                      <small className="error-text">{errors.weight}</small>
                    )}
                  </div>

                  <div
                    className={
                      errors.preferred_foot
                        ? "input-field error"
                        : "input-field"
                    }
                  >
                    <label htmlFor="preferred_foot">Preferred Foot</label>
                    <input
                      type="text"
                      id="preferred_foot"
                      value={preferred_foot}
                      onChange={(e) => setPreferredFoot(e.target.value)}
                      placeholder="Enter Preferred foot"
                    />
                    {errors.preferred_foot && (
                      <small className="error-text">
                        {errors.preferred_foot}
                      </small>
                    )}
                  </div>

                  <div
                    className={
                      errors.club_team ? "input-field error" : "input-field"
                    }
                  >
                    <label htmlFor="club_team">Current Football Club</label>
                    <input
                      type="text"
                      id="club_team"
                      value={club_team}
                      onChange={(e) => setFC(e.target.value)}
                      placeholder="Enter FC"
                    />
                    {errors.club_team && (
                      <small className="error-text">{errors.club_team}</small>
                    )}
                  </div>

                  <div
                    className={
                      errors.position ? "input-field error" : "input-field"
                    }
                  >
                    <label htmlFor="position">Preferred Position</label>
                    <input
                      type="text"
                      id="position"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="e.g. Striker"
                    />
                    {errors.position && (
                      <small className="error-text">{errors.position}</small>
                    )}
                  </div>

                  <div
                    className={
                      errors.county ? "input-field error" : "input-field"
                    }
                  >
                    <label htmlFor="county">County</label>
                    <select
                      id="county"
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      className="register-select"
                    >
                      <option value="" disabled>
                        Select county
                      </option>
                      {counties.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errors.county && (
                      <small className="error-text">{errors.county}</small>
                    )}
                  </div>
                </>
              )}

              {step === 2 && selectedRole === "Scout" && (
                <>
                  <div
                    className={
                      errors.organization ? "input-field error" : "input-field"
                    }
                  >
                    <label htmlFor="organization">Organization</label>
                    <input
                      type="text"
                      id="organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Enter Organization"
                    />
                    {errors.organization && (
                      <small className="error-text">
                        {errors.organization}
                      </small>
                    )}
                  </div>

                  <div
                    className={
                      errors.experience ? "input-field error" : "input-field"
                    }
                  >
                    <label htmlFor="experience">Experience</label>
                    <input
                      id="experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="Enter Experience"
                    />
                    {errors.experience && (
                      <small className="error-text">{errors.experience}</small>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="button-group">
              {step === 1 && (
                <button
                  type="submit"
                  onClick={handleContinue}
                  className="register-button"
                >
                  Next
                </button>
              )}

              {step === 2 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="container-button secondary"
                  >
                    Previous
                  </button>

                  <button
                    type="submit"
                    onClick={handleRegister}
                    className="container-button"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </form>

          <div className="container-footer">
            Have an account?
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
