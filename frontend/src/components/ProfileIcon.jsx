import React from "react";
import "./profileIcon.css";

const ProfileIcon = ({ initials = "PN", size = 190, className = "" }) => {
  const style = {
    width: `${size}px`,
    height: `${size * 0.93}px`,
  };

  return (
    <div className={`profile-icon-wrapper ${className}`}>
      <svg
        width={size}
        height={size * 0.93}
        viewBox="0 0 190 178"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="profile-icon"
        style={style}
      >
        <ellipse
          cx="94.951"
          cy="88.6726"
          rx="94.6346"
          ry="88.6311"
          fill="#D9D9D9"
        />
        <text
          x="24.5817"
          y="128.02"
          fill="white"
          style={{
            fontFamily: "Josefin Sans",
            fontSize: "96px",
            fontWeight: "bold",
          }}
        >
          {initials}
        </text>
      </svg>
    </div>
  );
};

export default ProfileIcon;
