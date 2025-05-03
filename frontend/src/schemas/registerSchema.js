import * as Yup from "yup";
import { counties } from "../pages/auth/register/components/register";

export const registerSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
    password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/\d/, 'Must contain at least one number')
    .matches(/[@$!%*?&#]/, 'Must contain at least one special character'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  user_type: Yup.string()
    .oneOf(["player", "scout","team"], "Role is required")
    .required("Role is required"),

  // Player fields
  yob: Yup.string().when("user_type", {
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

  //team fields
  name: Yup.string().when("user_type", {
    is: "team",
    then: (schema) => schema.required("Team Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  team_level: Yup.string().when("user_type", {
    is: "team",
    then: (schema) => schema.required("Team Level is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  county: Yup.string().when("user_type", {
    is: "team",
    then: (schema) => schema.required("County is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
