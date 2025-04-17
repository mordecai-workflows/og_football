import React from "react";
import "./FilterSection.css";

const FilterSection = () => {
  return (
    <div className="filter-container">
      <div className="filter-header">
        <div className="filter-title">Sort by</div>
        <div className="reset-section">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/df7da542716d4ba4d7ffbb9a87fc9faed7d3de72?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" alt="reset" className="reset-icon" />
          <div className="reset-text">Reset all</div>
        </div>
      </div>

      <div className="filter-content">
        <div className="filter-select">
          <div className="select-text">Select Role</div>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/55a3e6eed0c37fcd561f54315fcb69390aa783fe?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" alt="dropdown" className="select-icon" />
        </div>

        <div className="filter-select">
          <div className="select-text">Select age range</div>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/55a3e6eed0c37fcd561f54315fcb69390aa783fe?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" alt="dropdown" className="select-icon" />
        </div>

        <div className="filter-select">
          <div className="select-text">Select county</div>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/55a3e6eed0c37fcd561f54315fcb69390aa783fe?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" alt="dropdown" className="select-icon" />
        </div>

        <div className="filter-select">
          <div className="select-text">Select strong foot</div>
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/55a3e6eed0c37fcd561f54315fcb69390aa783fe?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" alt="dropdown" className="select-icon" />
        </div>

        <div className="matches-section">
          <div className="matches-label">Minimum matches played</div>
          <div className="slider-container">
            <div className="slider-dot" />
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/041eca4abfe70f01cc60300116dbf0c5fe76651f?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" alt="slider" className="slider-line" />
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
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/d51e0b226173aa8d08f1b5710c83b652bdcc1f8b?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" alt="min" className="range-icon" />
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/0196d8591ffaa475311d007f795f11feea0fe85e?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" alt="range" className="range-line" />
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/73e32a6fdf1589d9fa3536512ffd2fbecd734c63?placeholderIfAbsent=true&apiKey=07e439a3214d4eaf90a493d8230815a7" alt="max" className="range-icon" />
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
