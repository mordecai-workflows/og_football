import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetSchema } from "../schemas/resetSchema";
import Spinner from "../components/Spinner";
import InputField from "../components/InputField";
import PlatformName from "../components/PlatformName";
import "./resetlayout.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const formFields = [
  {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter new password",
    autoFocus: true,
  },
  {
    id: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm new password",
    autoFocus: true,
  },
];

export default function ResetPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [loading, setLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(resetSchema) });

  const validateToken = async () => {


    try {
      const res = await fetch(`${API_URL}/api/validate-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const result = await res.json();
      if (!res.ok || result.isValid === false) {
        setIsTokenValid(false);
        toast.error("Invalid or expired token.");
        setTimeout(() => navigate("/forgot"), 3000);
      }
    } catch (err) {
      setIsTokenValid(false);
      toast.error("Error validating token.");
      setTimeout(() => navigate("/forgot"), 3000);
    }
  };

  // Check the validity of the token on page load
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      toast.error("Invalid or missing reset token.");
      setTimeout(() => navigate("/forgot"), 3000);
      return;
    }
    validateToken(); // Call the token validation API only once
  }, [token, navigate]);

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
          ...(fld.id === "password" && { autoFocus: true }),
        }}
      />
    ));

  const onSubmit = async (data) => {
    if (loading || !isTokenValid) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, token }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Password reset failed");

      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!isTokenValid) {
    return (
      <div className="container-layout">
        <div className="credentials-box">
          <div className="logo">
            <PlatformName />
          </div>
          <div>
            <h2 className="page-title">Redirecting...</h2>
            <p className="page-subtext">You will be redirected to the Forgot Password page soon.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-layout">
      <div className="credentials-box">
        <div className="logo">
          <PlatformName />
        </div>

        <div>
          <h2 className="page-title">RESET PASSWORD</h2>
          <p className="page-subtext">Kindly enter your new password</p>
          <div className="container-form">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="page-fields">{renderFields(formFields)}</div>

              <button
                type="submit"
                className="container-button"
                disabled={loading}
              >
                {loading ? <Spinner /> : "Set Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
