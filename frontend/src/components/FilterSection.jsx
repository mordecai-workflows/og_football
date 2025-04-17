import React from "react";
import "./FilterSection.css";

const FilterSection = () => {
  return (
    <div className="filter-container">
      <div className="filter-header">
        <div className="filter-title">Sort by</div>
        <div className="reset-section">
          <div className="reset-text">Reset all</div>
        </div>
      </div>

      <div className="filter-content">
        <div className="filter-select">
          <div className="select-text">Select Role</div>
        </div>

        <div className="filter-select">
          <div className="select-text">Select age range</div>
        </div>

        <div className="filter-select">
          <div className="select-text">Select county</div>
        </div>

        <div className="filter-select">
          <div className="select-text">Select strong foot</div>
        </div>

        <div className="matches-section">
          <div className="matches-label">Minimum matches played</div>
          <div className="slider-container">
            <div className="slider-dot" />
          </div>
          <div className="slider-values">
            <div className="value-container">
              <div className="value-number">1</div>
              <div className="value-label">Player height (cm)</div>
            </div>
            <div className="value-container">
              <div className="value-number">26</div>
              <div className="value-range">105 - 200</div>
            </div>
          </div>
          <div className="range-slider">
          </div>
          <div className="range-values">
            <div className="range-number">105</div>
            <div className="range-number">200</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
