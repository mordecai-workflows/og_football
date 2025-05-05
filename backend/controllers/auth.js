import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { Op } from "sequelize";

import { sequelize } from "../config/database.js";
import User from "../models/user.js";
import Player from "../models/player.js";
import Scout from "../models/scouts.js";
import Team from "../models/team.js";

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
    associated_team,
    //Team details
    name,
    team_level,
  } = req.body || {};

  // Basic user details are mandatory
  if (!first_name || !last_name || !email || !password || !user_type) {
    return res.status(400).json({ message: "User details are incomplete" });
  }

  // Validate that the required extra details for each user type are present
  if (user_type === "player") {
    if (
      !yob ||
      !height ||
      !weight ||
      !preferred_foot ||
      !position ||
      !club_team ||
      !county
    ) {
      return res.status(400).json({ message: "Player details are incomplete" });
    }
  } else if (user_type === "scout") {
    if (!years_of_experience || !associated_team) {
      return res.status(400).json({ message: "Scout details are incomplete" });
    }
  } else if (user_type === "team") {
    if (!name || !county || !team_level) {
      return res.status(400).json({ message: "Team details are incomplete" });
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
        user_type,
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
          userId: newUser.id, // associate the Player with the User
        },
        { transaction: t }
      );
    } else if (user_type === "scout") {
      await Scout.create(
        {
          county,
          years_of_experience,
          associated_team,
          userId: newUser.id, // you can also add this if you have an association; adjust as needed
        },
        { transaction: t }
      );
    } else if (user_type === "team") {
      await Team.create(
        {
          name,
          county,
          team_level,
          userId: newUser.id, // Associate the Team with the User
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
    if (!user || !(await bcryptjs.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        user_type: user.user_type,
        name: user.first_name + " " + user.last_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function forgot(req, res) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour from now
    await user.save();

    // Create the reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset?token=${resetToken}`;

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email provider (e.g., Gmail, Outlook)
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error sending reset email:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function reset(req, res) {
  const { token, password, confirmPassword } = req.body;

  try {
    // Validate input
    if (!token || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by email and validate the token
    const user = await User.findOne({
      where: {
        email: decoded.email,
        resetToken: token,
        resetTokenExpiration: { [Op.gt]: Date.now() }, // Ensure token is not expired
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset token has expired" });
    }
    res.status(500).json({ message: "Something went wrong" });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
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
        if (years_of_experience)
          scout.years_of_experience = years_of_experience;
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
      attributes: ["first_name", "last_name", "email", "user_type"], // Fetch only relevant fields
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
      attributes: [
        "yob",
        "height",
        "weight",
        "preferred_foot",
        "position",
        "club_team",
        "county",
      ], // Fetch only relevant fields
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
  const { playerId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findByPk(playerId, {
      attributes: ["first_name", "last_name", "email", "user_type"], // Fetch only relevant fields
    });

    if (!user) {
      return res.status(404).json({ message: "Player not found" });
    }

    // Ensure the user is a player
    if (user.user_type !== "player") {
      return res
        .status(400)
        .json({ message: "The requested user is not a player" });
    }

    // Fetch the player's details
    const player = await Player.findOne({
      where: { userId: playerId },
      attributes: [
        "yob",
        "height",
        "weight",
        "preferred_foot",
        "position",
        "club_team",
        "county",
        "id",
      ],
    });

    if (!player) {
      return res.status(404).json({ message: "Player details not found" });
    }

    // Combine user and player details
    const playerProfile = {
      ...user.toJSON(),
      ...player.toJSON(),
    };
    console.log(playerProfile);
    return res.status(200).json(playerProfile);
  } catch (error) {
    console.error("Error fetching player profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get scout profile
export const getScoutProfile = async (req, res) => {
  const userId = req.userId; // Extracted from the middleware

  try {
    // Find the user by ID
    const user = await User.findByPk(userId, {
      attributes: ["first_name", "last_name", "email", "user_type"], // Fetch only relevant fields
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the user is a player
    if (user.user_type !== "scout") {
      return res.status(400).json({ message: "User is not a scout" });
    }
    // Fetch the scout's details
    const scout = await Scout.findOne({
      where: { userId },
      attributes: ["years_of_experience", "associated_team"], // Fetch only relevant fields
    });

    if (!scout) {
      return res.status(404).json({ message: "Scout details not found" });
    }

    // Combine user and scout details
    const scoutProfile = {
      ...user.toJSON(),
      ...scout.toJSON(),
    };

    res.status(200).json(scoutProfile);
  } catch (error) {
    console.error("Error fetching scout profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
