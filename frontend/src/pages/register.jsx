// src/pages/register.jsx
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import { registerSchema } from "../schemas/registerSchema";
import Spinner from "../components/Spinner";
import InputField from "../components/InputField";
import { roles, counties, step1Fields, playerFields, scoutFields } from "../components/register";

import "./layout.css";
import "./register.css";

const API_URL = import.meta.env.VITE_API_URL;

const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Registration failed");
  return result;
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/user/home", { replace: true });
    }
  }, [navigate]);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onTouched",
  });

  const userType = watch("user_type");

  const handleNext = async () => {
    setValidating(true);
    const valid = await trigger(step1Fields.map((f) => f.id));
    if (valid) setStep(2);
    setValidating(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success("Registration successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const renderFields = (fields) =>
    fields.map((fld) => (
      <InputField
        key={fld.id}
        id={fld.id}
        label={fld.label}
        type={fld.type}
        error={errors[fld.id]}
        placeholder={fld.placeholder}
        options={fld.options}
        disabled={loading}
        registerProps={{
          ...register(fld.id),
          ...(fld.autoFocus && { autoFocus: true }),
        }}
      />
    ));

  return (
    <div className="main-container">
      {/* Left Panel */}
      <div className="column left">
        <h1>Get started with O.G Football</h1>
        <p>Answer a couple of questions and we'll set up your account</p>
      </div>

      {/* Right Panel */}
      <div className="column right">
        <div className="container-form">
          <span className="container-title">Register</span>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="register-fields">
              {step === 1 && renderFields(step1Fields)}
              {step === 2 && userType === "player" && renderFields(playerFields)}
              {step === 2 && userType === "scout" && renderFields(scoutFields)}
            </div>

            <div className="button-group">
              {step === 1 ? (
                <button
                  type="button"
                  className="container-button"
                  onClick={handleNext}
                  disabled={validating}
                >
                  {validating ? <Spinner /> : "Next"}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="container-button secondary"
                    onClick={() => setStep(1)}
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    className="container-button"
                    disabled={loading}
                  >
                    {loading ? <Spinner /> : "Register"}
                  </button>
                </>
              )}
            </div>
          </form>

          <div className="container-footer">
            Have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
