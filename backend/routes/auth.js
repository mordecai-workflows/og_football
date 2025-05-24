import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import {
  loginUser,
  registerUser,
  forgot,
  reset,
  logout,
  deleteUserAccount,
  editUserInfo,
  getPlayerInfo,
  getPlayerProfile,
  getScoutProfile,
  getTeamProfile,
} from "../controllers/auth.js";
import {
  getAllPlayers,
  getPlayersForLoggedInTeam,
  addPlayerToTeam,
  removePlayerFromTeam,
  getAllOpponentTeams,
} from "../controllers/team.js";
import { getFilteredPlayersForScout } from "../controllers/player.js";

import {
  createShortlist,
  addPlayerToShortlist,
  getShortlists,
  removePlayerFromShortlist,
  deleteShortlist
} from "../controllers/shortlist.js";
import { addMatch, getAllMatches, editMatch, deleteMatch } from "../controllers/match.js";

import {
  addOrUpdatePlayerStats,
  getPlayerStats,
  getTeamPlayersStatsSummary,
  deletePlayerStats,
  getPlayerAnalytics,
} from "../controllers/playerStats.js";

import User from "../models/user.js";
import { extractUserId } from "../Middleware/auth.js";

dotenv.config();
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot", forgot);
router.post("/reset", reset);
router.post("/logout", logout);

router.delete("/delete", extractUserId, deleteUserAccount);
router.put("/edit", extractUserId, editUserInfo);
router.get("/player", extractUserId, getPlayerInfo);
router.get("/scout/profile", extractUserId, getScoutProfile);
router.get("/player/:playerId", extractUserId, getPlayerProfile);
router.get("/scout/players", getFilteredPlayersForScout);

/// Shortlisting
router.post("/shortlist/create", extractUserId, createShortlist);
router.post("/shortlist/add", extractUserId, addPlayerToShortlist);
router.get("/shortlist", extractUserId, getShortlists);
router.delete("/shortlist/remove", extractUserId, removePlayerFromShortlist);
router.delete("/shortlist/delete", extractUserId, deleteShortlist);

// Get Team Profile
router.get("/team/profile", extractUserId, getTeamProfile);

// Add or Update Player Stats
router.post("/stats", addOrUpdatePlayerStats);

// Get All Stats for a Specific Player
router.get("/stats/:playerId", getPlayerStats);
//Delete Player Stats
router.delete("/stats/:playerId/:matchId", extractUserId, deletePlayerStats);
//get stat summary for players in a team
router.get("/stats/team/summary", extractUserId, getTeamPlayersStatsSummary);

router.get("/player/analytics", extractUserId, getPlayerAnalytics);





// Add a match (home team is automatically set as the logged-in user's team)
router.post("/match/add", extractUserId, addMatch);

// Get all matches for the logged-in user's team
router.get("/match/all", extractUserId, getAllMatches);

// Edit a match
router.put("/match/edit/:matchId", extractUserId, editMatch);

// Delete a match
router.delete("/match/delete/:matchId", extractUserId, deleteMatch);

// Get all opponent teams
router.get("/team/opponents", extractUserId, getAllOpponentTeams);






// Get all players
router.get("/team/allplayers", extractUserId, getAllPlayers);

// Get players for the logged-in user's team
router.get("/team/players", extractUserId, getPlayersForLoggedInTeam);

// Add a player to a team
router.post("/team/add-player", extractUserId, addPlayerToTeam);

// Remove a player from a team
router.post("/team/remove-player", extractUserId, removePlayerFromTeam);


// Frontend continous auth
router.get("/auth/verify", (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(200).json({ valid: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.post("/validate-token", async (req, res) => {
  const { token } = req.body;
  try {
    // Decode and validate token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token is valid
    const user = await User.findOne({
      where: { email: decoded.email, resetToken: token },
    });

    if (!user || Date.now() > user.resetTokenExpiration) {
      return res.status(400).json({ isValid: false });
    }

    res.status(200).json({ isValid: true });
  } catch (err) {
    res.status(400).json({ isValid: false });
  }
});

export default router;
