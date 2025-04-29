import express from "express";
import dotenv from "dotenv";
import { connectDB, disconnectDB, sequelize } from "./config/database.js";
import api from "./routes/auth.js";
import media from "./routes/uploads.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: true, // or your frontend origin
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", api);
app.use("/media", media);

(async () => {
  await connectDB();
  sequelize
    .sync()
    .then(() => console.log("Database synced successfully"))
    .catch((error) => console.error("Error syncing database:", error.message));

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Graceful shutdown handling
  process.on("SIGINT", async () => {
    await disconnectDB();
    console.log("Server shutting down gracefully");
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    await disconnectDB();
    console.log("Server shutting down gracefully");
    process.exit(0);
  });
})();
