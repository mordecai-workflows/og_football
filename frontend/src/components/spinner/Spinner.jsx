import React, { memo } from "react";
import "./Spinner.css"; // you can also co‑locate styles in this file

const Spinner = memo(function Spinner() {
  return <div className="spinner" aria-label="Loading"></div>;
});

export default Spinner;
