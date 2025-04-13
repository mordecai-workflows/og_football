import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotSchema } from "../schemas/forgotSchema";
import Spinner from "../components/Spinner";
import InputField from "../components/InputField";
import PlatformName from "../components/PlatformName";
import "./resetlayout.css";
import "./forgot.css";

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
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(forgotSchema) });

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
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to send reset email");

      toast.success("Reset link sent to your email.");
    } catch (err) {
      toast.error(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-layout">
      <div className="go-back">
        <Link to="/login" className="back-link">
          <span className="arrow">←</span> Go back
        </Link>
      </div>

      <div className="credentials-box">
        <div className="logo">
          <PlatformName />
        </div>

        <div className="content">
          <h2 className="page-title">FORGOT PASSWORD</h2>
          <p className="page-subtext">
            Kindly enter your email address to reset password
          </p>

          <div className="container-form">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="page-fields">{renderFields(formFields)}</div>

              <button
                type="submit"
                className="container-button"
                disabled={loading}
              >
                {loading ? <Spinner /> : "Send Reset Link"}
              </button>
            </form>
          </div>

          <div className="container-footer">
            Remembered your password? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
