import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import { loginSchema } from "../../../schemas/loginSchema";
import Spinner from "../../../components/spinner/Spinner";
import InputField from "../../../components/InputField";
import PlatformName from "../../../components/platformname/PlatformName";
import { useAuth } from "../../../context/AuthContext";
import FullScreenSpinner from "../../../components/fullscreenspinner/FullScreenSpinner";

import "../layout.css";
import "./login.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const formFields = [
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter email address",
    autoFocus: true,
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter password",
  },
];

const fetchJSON = async (url, options = {}) => {
  const res = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

const navigateBasedOnRole = (navigate, role) => {
  setTimeout(
    () => navigate(role === "admin" ? "/admin/dashboard" : "/player/home"),
    1500
  );
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, setUser, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const didCheckRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  useEffect(() => {
    if (!authLoading && !didCheckRef.current) {
      didCheckRef.current = true;
      if (user) {
        toast.info("Already logged in.");
        navigateBasedOnRole(navigate, user.user_type);
      }
    }
  }, [authLoading, user, navigate]);

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);
    try {
      await fetchJSON(`${API_URL}/api/login`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      const verifyData = await fetchJSON(`${API_URL}/api/auth/verify`, {
        method: "GET",
      });
      if (!verifyData.valid) throw new Error("Session verification failed");

      setUser(verifyData.user);
      toast.success("Login successful!");
      navigateBasedOnRole(navigate, verifyData.user.user_type);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderedFields = useMemo(
    () =>
      formFields.map((fld) => (
        <InputField
          key={fld.id}
          id={fld.id}
          label={fld.label}
          type={fld.type}
          error={errors[fld.id]}
          placeholder={fld.placeholder}
          disabled={loading}
          registerProps={{
            ...register(fld.id),
            ...(fld.autoFocus && { autoFocus: true }),
          }}
        />
      )),
    [errors, loading, register]
  );

  if (authLoading) {
    return <FullScreenSpinner />;
  }

  return (
    <div className="main-container">
      {/* Left Panel */}
      <div className="column left">
        <div className="logo">
          <PlatformName />
        </div>
        <div className="login-image">
          <img src="/login_img.png" alt="login" />
        </div>
        <div className="login-text">
          <h2>Opportunity Generator</h2>
          <p>
            Discover Africa’s rising football stars! Our platform connects
            talent with scouts and sponsors, ensuring recognition,
            opportunities, and success across the continent.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="column right">
        <div className="container-form">
          <span className="container-title">Login</span>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="login-fields">{renderedFields}</div>

            <Link to="/forgot" className="forgot-link">
              Forgot password?
            </Link>

            <button
              type="submit"
              className="container-button"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Login"}
            </button>
          </form>

          <div className="container-footer">
            New to O.G Football? <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
