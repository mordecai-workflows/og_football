import * as Yup from "yup";

export const registerSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  user_type: Yup.string()
    .oneOf(["player", "scout"], "Role is required")
    .required("Role is required"),

  // Player fields
  dob: Yup.string().when("user_type", {
    is: "player",
    then: (schema) => schema.required("Date of Birth is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  height: Yup.string().when("user_type", {
    is: "player",
    then: (schema) => schema.required("Height is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  weight: Yup.string().when("user_type", {
    is: "player",
    then: (schema) => schema.required("Weight is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  preferred_foot: Yup.string().when("user_type", {
    is: "player",
    then: (schema) => schema.required("Preferred Foot is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  club_team: Yup.string().when("user_type", {
    is: "player",
    then: (schema) => schema.required("Football Club is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  position: Yup.string().when("user_type", {
    is: "player",
    then: (schema) => schema.required("Position is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  county: Yup.string().when("user_type", {
    is: "player",
    then: (schema) => schema.required("County is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  // Scout fields
  associated_team: Yup.string().when("user_type", {
    is: "scout",
    then: (schema) => schema.required("Associated Team is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  years_of_experience: Yup.string().when("user_type", {
    is: "scout",
    then: (schema) => schema.required("Experience is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
