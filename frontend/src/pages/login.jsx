import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../schemas/loginSchema";
import Spinner from "../components/Spinner";
import InputField from "../components/InputField";
import PlatformName from "../components/PlatformName";
import "./layout.css";
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

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  // Check the validity of the token on page load
  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/verify", {
          method: "GET",
          credentials: "include",
        });

        const result = await res.json();

        if (res.ok && result.valid) {
          setIsTokenValid(true);
          toast.info("Already logged in.");
          setTimeout(() => navigate("/user/home"), 1500);
        } else {
          setIsTokenValid(false);
        }
      } catch (err) {
        setIsTokenValid(false);
      }
    };

    validateToken();
  }, [navigate]);

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
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Login failed");

      toast.success("Login successful!");
      setTimeout(() => navigate("/user/home"), 1500);
    } catch (err) {
      toast.error(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  // Prevent flicker if already logged in
  if (isTokenValid) {
    return (
      <div className='spinner-overlay'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='main-container'>
      {/* Left Panel */}
      <div className='column left'>
        <div className='logo'>
          <PlatformName />
        </div>
        <div className='login-image'>
          <img src='/login_img.png' alt='login' />
        </div>
        <div className='login-text'>
          <h2>Opportunity Generator</h2>
          <p>
            Discover Africa’s rising football stars! Our platform connects
            talent with scouts and sponsors, ensuring recognition,
            opportunities, and success across the continent.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className='column right'>
        <div className='container-form'>
          <span className='container-title'>Login</span>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className='login-fields'>{renderFields(formFields)}</div>

            <Link to='/forgot' className='forgot-link'>
              Forgot password?
            </Link>

            <button
              type='submit'
              className='container-button'
              disabled={loading}
            >
              {loading ? <Spinner /> : "Login"}
            </button>
          </form>

          <div className='container-footer'>
            New to O.G Football? <Link to='/register'>Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
