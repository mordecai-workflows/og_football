import "./layout.css";
import "./register.css";
import { Link } from "react-router-dom";

export default function RegisterPage() {
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

  return (
    <div className="main-container">
      {/* Left Panel */}
      <div className="column left">
        <h1>Get started with O.G Football</h1>
        <p>
          Answer a couple of questions and we'll get you started with your O.G
          Football account
        </p>
        {/* Optional extras: illustration, description, pagination, next-btn */}
      </div>

      {/* Right Panel */}
      <div className="column right">
        {/* Form */}
        <div className="container-form">
          <span className="container-title">Register</span>
          <form action="" method="post">
            <div className="form-fields">
              <div>
                <label htmlFor="email">First Name</label>
                <input
                  type="text"
                  name="firstname"
                  id="firstname"
                  placeholder="Enter First Name "
                />
              </div>
              <div>
                <label htmlFor="email">Last Name</label>
                <input
                  type="text"
                  name="lastname"
                  id="lastname"
                  placeholder="Enter Last Name "
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label htmlFor="county">County</label>
                <select
                  id="county"
                  name="county"
                  className="register-select"
                  defaultValue=""
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
              </div>
            </div>

            <button type="submit" className="container-button">
              Register
            </button>
          </form>

          {/* Bottom Line */}
          <div className="container-footer">
            Have an account?
            <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
