import React, { useState } from "react";
import "./FilterSection.css";

const FilterSection = () => {
  const [filters, setFilters] = useState({
    role: "",
    ageRange: "",
    county: "",
    strongFoot: "",
    matchesPlayed: 1,
    height: { min: 105, max: 200 },
  });

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="filter-container">
      <div className="filter-header">
        <div className="filter-title">Sort by</div>
        <div className="reset-section">
          <div className="reset-text">Reset all</div>
        </div>
      </div>

      <div className="filter-content">
        <select
          className="filter-select"
          value={filters.role}
          onChange={(e) => handleFilterChange("role", e.target.value)}
        >
          <option value="">Select Role</option>
          <option value="ST">ST</option>          
          <option value="RW">RW</option>
          <option value="LW">LW</option>
          <option value="CM">CM</option>
          <option value="CDM">CDM</option>
          <option value="CAM">CAM</option>
          <option value="LWB">LWB</option>
          <option value="RWB">RWB</option>
          <option value="LB">LB</option>
          <option value="RB">RB</option>          
          <option value="CB">CB</option>
          <option value="GK">GK</option>
        </select>

        <select
          className="filter-select"
          value={filters.ageRange}
          onChange={(e) => handleFilterChange("ageRange", e.target.value)}
        >
          <option value="">Select age range</option>
          <option value="16-18">16-18</option>
          <option value="19-21">19-21</option>
          <option value="22-25">22-25</option>
          <option value="26+">26+</option>
        </select>

        <select
          className="filter-select"
          value={filters.county}
          onChange={(e) => handleFilterChange("county", e.target.value)}
        >
          <option value="">Select county</option>
          <option value="county1">County 1</option>
          <option value="county2">County 2</option>
          <option value="county3">County 3</option>
        </select>

        <select
          className="filter-select"
          value={filters.strongFoot}
          onChange={(e) => handleFilterChange("strongFoot", e.target.value)}
        >
          <option value="">Select strong foot</option>
          <option value="left">Left</option>
          <option value="right">Right</option>
          <option value="both">Both</option>
        </select>

      </div>
    </div>
  );
};

export default FilterSection;
