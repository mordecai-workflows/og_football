import { useState } from "react";

export default function useFormWithSchema(initialValues, schema, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schema.validate(values, { abortEarly: false });
      setErrors({});
      setLoading(true);
      setSuccessMessage("");
      setErrorMessage("");

      await onSubmit(values, { setSuccessMessage, setErrorMessage, setLoading });
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        setErrorMessage("Unexpected error occurred");
      }
    }
  };

  return {
    values,
    errors,
    loading,
    successMessage,
    errorMessage,
    handleChange,
    handleSubmit,
  };
}
