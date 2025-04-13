import React from "react";

export default function InputField({
  id,
  label,
  type,
  error,
  registerProps,
  options,
  placeholder,
}) {
  return (
    <div className={`input-field ${error ? "error" : ""}`}>
      <label htmlFor={id}>{label}</label>

      {type === "select" ? (
        <select id={id} {...registerProps} aria-invalid={!!error}>
          <option value="" >
            {placeholder || `Select ${label}`}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          aria-invalid={!!error}
          {...registerProps}
        />
      )}

      {error && <small className="error-text">{error.message}</small>}
    </div>
  );
}
