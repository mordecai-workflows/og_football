import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotSchema } from "../schemas/forgotSchema"; 
import Spinner from "../components/Spinner";
import InputField from "../components/InputField";
import "./forgot.css";
import "./layout.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const formFields = [
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter email address",
    autoFocus: true,
  },
];

export default function ForgotPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(forgotSchema) }); // Assuming you've defined the schema

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

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include", // if needed
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Email send failed");

      toast.success("Email sent successfully!");
      setTimeout(() => navigate("/forgot/otp"), 1500);
    } catch (err) {
      toast.error(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-container">
      {/* Left Panel */}
      <div className="column left">
        <h1>O.G Football</h1>
        <div className="forgot-image">
          <img src="/forgot_img.png" alt="forgot" />
        </div>
        <div className="forgot-text">
          <h2>Forgot Password?</h2>
          <p>
            Please enter your email address to receive a password reset link.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="column right">
        <div className="container-form">
          <span className="container-title">Forgot Password</span>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="forgot-fields">
              {renderFields(formFields)}
            </div>

            <button
              type="submit"
              className="container-button"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Send Reset Link"}
            </button>
          </form>

          <div className="container-footer">
            Remembered your password? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
