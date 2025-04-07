import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

import { sequelize } from "../config/database.js";
import User from "../models/user.js";
import Player from "../models/player.js";
import Scout from "../models/scouts.js";

dotenv.config();

export async function registerUser(req, res) {
  const {
    first_name,
    last_name,
    email,
    password,
    user_type,
    // Player details
    yob,
    height,
    weight,
    preferred_foot,
    position,
    club_team,
    county,
    // Scout details
    years_of_experience,
    associated_team
  } = req.body || {};

  // Basic user details are mandatory
  if (!first_name || !last_name || !email || !password || !user_type) {
    return res.status(400).json({ message: "User details are incomplete" });
  }

  // Validate that the required extra details for each user type are present
  if (user_type === "player") {
    if (!yob || !height || !weight || !preferred_foot || !position || !club_team || !county) {
      return res.status(400).json({ message: "Player details are incomplete" });
    }
  } else if (user_type === "scout") {
    if (!county || !years_of_experience || !associated_team) {
      return res.status(400).json({ message: "Scout details are incomplete" });
    }
  } else {
    return res.status(400).json({ message: "Invalid user type" });
  }

  const t = await sequelize.transaction();

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create the User record within the transaction
    const newUser = await User.create(
      {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        user_type
      },
      { transaction: t }
    );

    // Create the associated record based on user_type
    if (user_type === "player") {
      await Player.create(
        {
          yob,
          height,
          weight,
          preferred_foot,
          position,
          club_team,
          county,
          userId: newUser.id // associate the Player with the User
        },
        { transaction: t }
      );
    } else if (user_type === "scout") {
      await Scout.create(
        {
          county,
          years_of_experience,
          associated_team,
          userId: newUser.id // you can also add this if you have an association; adjust as needed
        },
        { transaction: t }
      );
    }

    // Commit the transaction if all creations succeed
    await t.commit();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Rollback the transaction if any error occurs
    await t.rollback();
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
