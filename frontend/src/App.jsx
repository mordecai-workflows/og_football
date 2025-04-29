import "./App.css";
import { Link } from "react-router-dom";
import PlatformName from "./components/PlatformName";
import { useState } from "react";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">
            <PlatformName />
          </div>

          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </div>

          <div className={`parts ${menuOpen ? "show" : ""}`}>
            <Link to="#">Features</Link>
            <Link to="#">Contacts</Link>
            <Link to="#">Why us</Link>
          </div>

          <div className="buttons">
            <button>
              <Link to="/login">Login</Link>
            </button>
            <button>
              <Link to="/register">Sign up for free</Link>
            </button>
          </div>
        </div>
      </nav>

      <div className="main-wrapper">
        <main className="main-content">
          <h1>Discover the best football players in Africa using data</h1>
          <p>
            OG football offers football stakeholders a robust scouting tool to
            enhance their recruitment decisions for players in Africa.
          </p>
          <button className="signup-button">
            <Link to="/register">Sign up for free</Link>
          </button>

          <div className="hero-image-container">
            <img
              src="/hero.png"
              alt="Football data collage"
              className="hero-image"
            />
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
