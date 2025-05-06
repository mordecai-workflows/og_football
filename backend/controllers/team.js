import Player from "../models/player.js";
import Team from "../models/team.js";
import User from "../models/user.js";

/**
 * Get all players in the database
 */
export const getAllPlayers = async (req, res) => {
  try {
    // Fetch all players, regardless of their team
    const players = await Player.findAll({
      include: [
        { model: User, attributes: ["first_name", "last_name"] }, // Include user details
      ],
    });

    if (!players || players.length === 0) {
      return res.status(404).json({ message: "No players found" });
    }

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

    if (!players || players.length === 0) {
      return res.status(404).json({ message: "No players found for this team" });
    }

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