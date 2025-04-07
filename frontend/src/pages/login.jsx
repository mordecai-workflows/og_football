import "./layout.css";
import "./login.css";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="main-container">
      {/* Left Panel */}
      <div className="column left">
        <h1>O.G Football</h1>

        <div className="login-image">
          <img src="/login_img.png" alt="login-image" />
        </div>

        <div className="login-text">
          <h2>Opportunity Generator</h2>
          <p>
            Discover Africa’s rising football stars! Our platform connects
            talent with scouts and sponsors, ensuring recognition,
            opportunities, and success across the continent.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="column right">
        {/* Login Form */}
        <div className="container-form">
          <span className="container-title">Login</span>
          <form action="" method="post">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              placeholder="Enter email address"
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Enter password"
            />

            <Link to="/forgot" className="forgot-link">
              Forgot password?
            </Link>

            <button type="submit" className="container-button">
              Login
            </button>
          </form>

          {/* Bottom “Register” line */}
          <div className="container-footer">
            New to O.G Football?
            <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
