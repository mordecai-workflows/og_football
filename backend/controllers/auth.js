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
  console.log(req.body)

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
    if ( !years_of_experience || !associated_team) {
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

export async function loginUser(req, res) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !await bcryptjs.compare(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',     
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login Successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//Delete user account
export const deleteUserAccount = async (req, res) => {
  const userId = req.userId; // Extracted from the middleware

  try {
    // Find the user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await user.destroy();
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//edit user account
export const editUserInfo = async (req, res) => {
  const userId = req.userId; // Extracted from the middleware
  const {
    first_name,
    last_name,
    email,
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
    associated_team,
  } = req.body || {};

  try {
    // Find the user by ID
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic user details (excluding password)
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (email) user.email = email;

    await user.save();

    // Update associated details based on user_type
    if (user.user_type === "player") {
      const player = await Player.findOne({ where: { userId } });
      if (player) {
        if (yob) player.yob = yob;
        if (height) player.height = height;
        if (weight) player.weight = weight;
        if (preferred_foot) player.preferred_foot = preferred_foot;
        if (position) player.position = position;
        if (club_team) player.club_team = club_team;
        if (county) player.county = county;

        await player.save();
      }
    } else if (user.user_type === "scout") {
      const scout = await Scout.findOne({ where: { userId } });
      if (scout) {
        if (years_of_experience) scout.years_of_experience = years_of_experience;
        if (associated_team) scout.associated_team = associated_team;
        if (county) scout.county = county;

        await scout.save();
      }
    }

    res.status(200).json({ message: "User information updated successfully" });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




//Get player profile
export const getPlayerInfo = async (req, res) => {
  const userId = req.userId; // Extracted from the middleware

  try {
    // Find the user by ID
    const user = await User.findByPk(userId, {
      attributes: ['first_name', 'last_name', 'email', 'user_type'], // Fetch only relevant fields
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the user is a player
    if (user.user_type !== "player") {
      return res.status(400).json({ message: "User is not a player" });
    }

    // Fetch the player's details
    const player = await Player.findOne({
      where: { userId },
      attributes: ['yob', 'height', 'weight', 'preferred_foot', 'position', 'club_team', 'county'], // Fetch only relevant fields
    });

    if (!player) {
      return res.status(404).json({ message: "Player details not found" });
    }

    // Combine user and player details
    const playerInfo = {
      ...user.toJSON(),
      ...player.toJSON(),
    };

    res.status(200).json(playerInfo);
  } catch (error) {
    console.error("Error fetching player information:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// others to get player profile
export const getPlayerProfile = async (req, res) => {
  const { playerId } = req.params; // Extract playerId from the route parameter


  try {
    // Find the user by ID
    const user = await User.findByPk(playerId, {
      attributes: ['first_name', 'last_name', 'email', 'user_type'], // Fetch only relevant fields
    });

    if (!user) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Ensure the user is a player
    if (user.user_type !== "player") {
      return res.status(400).json({ message: "The requested user is not a player" });
    }

    // Fetch the player's details
    const player = await Player.findOne({
      where: { userId: playerId },
      attributes: ['yob', 'height', 'weight', 'preferred_foot', 'position', 'club_team', 'county'], // Fetch only relevant fields
    });

    if (!player) {
      return res.status(404).json({ message: "Player details not found" });
    }

    // Combine user and player details
    const playerProfile = {
      ...user.toJSON(),
      ...player.toJSON(),
    };

    res.status(200).json(playerProfile);
  } catch (error) {
    console.error("Error fetching player profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};