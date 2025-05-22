import Player from "../models/player.js";
import Team from "../models/team.js";
import User from "../models/user.js";
import { Op } from "sequelize";


export const getAllOpponentTeams = async (req, res) => {
  const userId = req.userId;

  try {
    // Find the team managed by the logged-in user
    const myTeam = await Team.findOne({ where: { userId } });

    if (!myTeam) {
      return res.status(404).json({ message: "Your team not found" });
    }

    // Fetch all teams except the user's own team
    const teams = await Team.findAll({
      where: { id: { [Op.ne]: myTeam.id } },
      attributes: ["id", "name", "county", "team_level"], // Adjust attributes as needed
    });

    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching opponent teams:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get all players in the database
 */
export const getAllPlayers = async (req, res) => {
  const userId = req.userId; // Extract userId from the request (e.g., from a token)

  try {
    // Find the team associated with the logged-in user
    const team = await Team.findOne({ where: { userId } });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Fetch all players NOT in the user's team
    const players = await Player.findAll({
      where: { club_team: { [Op.ne]: team.name } }, // Not equal to the user's team name
      include: [
        { model: User, attributes: ["first_name", "last_name"] }, // Include user details
      ],
    });

    res.status(200).json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get players for the logged-in user's team
 */
export const getPlayersForLoggedInTeam = async (req, res) => {
  const userId = req.userId; // Extract userId from the request (e.g., from a token)

  try {
    // Find the team associated with the logged-in user
    const team = await Team.findOne({ where: { userId } });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Fetch all players belonging to the team
    const players = await Player.findAll({
      where: { club_team: team.name },
      include: [
        { model: User, attributes: ["first_name", "last_name"] }, // Include user details
      ],
    });

   

    res.status(200).json(players);
  } catch (error) {
    console.error("Error fetching player information:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Add a player to the logged-in user's team
 */
export const addPlayerToTeam = async (req, res) => {
  const { playerId } = req.body;
  const userId = req.userId;

  try {
    // Find the team associated with the logged-in user
    const team = await Team.findOne({ where: { userId } });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Update the player's club_team to the team's name
    const player = await Player.findByPk(playerId);
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    player.club_team = team.name;
    await player.save();

    res.status(200).json({ message: "Player added to team successfully", player });
  } catch (error) {
    console.error("Error adding player to team:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Remove a player from the logged-in user's team
 */
export const removePlayerFromTeam = async (req, res) => {
  const { playerId } = req.body;

  try {
    // Find the player and remove them from the team
    const player = await Player.findByPk(playerId);
    if (!player || !player.club_team) {
      return res.status(404).json({ message: "Player not found or not assigned to a team" });
    }

    player.club_team = "Not Assigned"; // Reset the club_team to indicate removal
    await player.save();

    res.status(200).json({ message: "Player removed from team successfully" });
  } catch (error) {
    console.error("Error removing player from team:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};