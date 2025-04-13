const roles = ["player", "scout"];

const counties = [
  "Mombasa",
  "Kwale",
  "Kilifi",
  "Tana River",
  "Lamu",
  "Taita‑Taveta",
  "Garissa",
  "Wajir",
  "Mandera",
  "Marsabit",
  "Isiolo",
  "Meru",
  "Tharaka‑Nithi",
  "Embu",
  "Kitui",
  "Machakos",
  "Makueni",
  "Nyandarua",
  "Nyeri",
  "Kirinyaga",
  "Murang'a",
  "Kiambu",
  "Turkana",
  "West Pokot",
  "Samburu",
  "Trans Nzoia",
  "Uasin Gishu",
  "Elgeyo‑Marakwet",
  "Nandi",
  "Baringo",
  "Laikipia",
  "Nakuru",
  "Narok",
  "Kajiado",
  "Kericho",
  "Bomet",
  "Kakamega",
  "Vihiga",
  "Bungoma",
  "Busia",
  "Siaya",
  "Kisumu",
  "Homa Bay",
  "Migori",
  "Kisii",
  "Nyamira",
  "Nairobi",
];

const step1Fields = [
  {
    id: "first_name",
    label: "First Name",
    type: "text",
    placeholder: "Enter First Name",
    autoFocus: true,
  },
  {
    id: "last_name",
    label: "Last Name",
    type: "text",
    placeholder: "Enter Last Name",
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter email address",
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter password",
  },
  {
    id: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm Password",
  },
  {
    id: "user_type",
    label: "Role",
    type: "select",
    options: roles,
    placeholder: "Select Role",
  },
];

const playerFields = [
  { id: "yob", label: "Date of Birth", type: "date" },
  { id: "height", label: "Height", type: "text", placeholder: "Enter Height" },
  { id: "weight", label: "Weight", type: "text", placeholder: "Enter Weight" },
  {
    id: "preferred_foot",
    label: "Preferred Foot",
    type: "text",
    placeholder: "Enter Preferred Foot",
  },
  {
    id: "club_team",
    label: "Football Club",
    type: "text",
    placeholder: "Enter Club Name",
  },
  {
    id: "position",
    label: "Position",
    type: "text",
    placeholder: "e.g. Striker",
  },
  {
    id: "county",
    label: "County",
    type: "select",
    options: counties,
    placeholder: "Select County",
  },
];

const scoutFields = [
  {
    id: "associated_team",
    label: "Associated Team",
    type: "text",
    placeholder: "Enter Associated Team",
  },
  {
    id: "years_of_experience",
    label: "Experience (years)",
    type: "text",
    placeholder: "Enter Experience",
  },
];

export {roles, counties,step1Fields, playerFields, scoutFields}