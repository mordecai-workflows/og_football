"use client";
import React from "react";
import styles from "./editProfile.css";

const Logo = () => (
  <svg
    width="226"
    height="40"
    viewBox="0 0 226 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="logo"
  >
    <g filter="url(#filter0_dd_25_185)">
      <text
        fill="black"
        xmlSpace="preserve"
        style={{ whiteSpace: "pre" }}
        fontFamily="Josefin Sans"
        fontSize="36"
        fontWeight="bold"
        letterSpacing="0em"
      >
        <tspan x="3" y="32">
          O
        </tspan>
        <tspan x="39.8438" y="32">
          G Football
        </tspan>
      </text>
      <text
        fill="#16F60E"
        xmlSpace="preserve"
        style={{ whiteSpace: "pre" }}
        fontFamily="Josefin Sans"
        fontSize="36"
        fontWeight="bold"
        letterSpacing="0em"
      >
        <tspan x="33.6562" y="32">
          .
        </tspan>
      </text>
    </g>
    <path
      d="M3 38C3 36.8954 3.89543 36 5 36H101V40H5C3.89543 40 3 39.1046 3 38Z"
      fill="black"
    />
    <path d="M101 36H219V40H101V36Z" fill="#16F60E" />
    <defs>
      <filter
        id="filter0_dd_25_185"
        x="0.799988"
        y="0.596191"
        width="220.059"
        height="36.8359"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feMorphology
          radius="1"
          operator="dilate"
          in="SourceAlpha"
          result="effect1_dropShadow_25_185"
        />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="1.5" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_25_185"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_25_185"
          result="effect2_dropShadow_25_185"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow_25_185"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

const UserAvatar = ({ size = "small" }) => (
  <svg
    width={size === "large" ? "190" : "39"}
    height={size === "large" ? "178" : "38"}
    viewBox={size === "large" ? "0 0 190 178" : "0 0 39 38"}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse
      cx={size === "large" ? "94.951" : "19.5"}
      cy={size === "large" ? "88.6726" : "19"}
      rx={size === "large" ? "94.6346" : "19.5"}
      ry={size === "large" ? "88.6311" : "19"}
      fill="#D9D9D9"
    />
    <text
      fill="white"
      xmlSpace="preserve"
      style={{ whiteSpace: "pre" }}
      fontFamily="Josefin Sans"
      fontSize={size === "large" ? "96" : "20"}
      fontWeight="bold"
      letterSpacing="0em"
    >
      <tspan
        x={size === "large" ? "24.5817" : "5"}
        y={size === "large" ? "128.02" : "27"}
      >
        PN
      </tspan>
    </text>
  </svg>
);

const FormInput = ({ label, type = "text" }) => (
  <div className={styles.inputWrapper}>
    <label className={styles.inputLabel}>{label}</label>
    <input type={type} className={styles.input} />
  </div>
);

const ProfilePage = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Alexandria&family=Albert+Sans&family=Fira+Sans&family=Inria+Sans&family=Josefin+Sans:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <main className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logoWrapper}>
            <Logo />
          </div>
          <nav className={styles.navigation}>
            <a href="#" className={styles.navLink}>
              Home
            </a>
          </nav>
          <div className={styles.userInfo}>
            <UserAvatar />
            <div className={styles.userDetails}>
              <span className={styles.userName}>Player Name</span>
              <span className={styles.userCategory}>Category</span>
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/b8c51ada058ef79d959ec6bbf058340b9bea4e94?placeholderIfAbsent=true" alt="dropdown" className={styles.dropdownIcon} />
            </div>
          </div>
        </header>

        <div className={styles.divider} />

        <section className={styles.content}>
          <div className={styles.sectionHeader}>
            <h1 className={styles.profileBadge}>Profile</h1>
          </div>

          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <UserAvatar size="large" />
              <div className={styles.profileInfo}>
                <h2 className={styles.profileName}>Player Name</h2>
                <p className={styles.profileCategory}>Category -</p>
                <button className={styles.changePhotoBtn}>Change photo</button>
              </div>
            </div>

            <form className={styles.formGrid}>
              <FormInput label="First Name" />
              <FormInput label="Second name" />
              <FormInput label="Email Address" />
              <FormInput label="Contact Number" />
              <FormInput label="County of residence" />
              <FormInput label="Proffession" />
              <FormInput label="Password" type="password" />

              <button type="submit" className={styles.submitButton}>
                Save changes
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default ProfilePage;
