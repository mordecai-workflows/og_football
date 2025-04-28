import React from "react";
import Spinner from "./Spinner";

// A reusable full-screen loading overlay
export default function FullScreenSpinner() {
  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  return (
    <div style={overlayStyle}>
      <Spinner />
    </div>
  );
}
