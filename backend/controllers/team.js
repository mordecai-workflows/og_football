import Player from "../models/player.js";
import Team from "../models/team.js";
import User from "../models/user.js";

/**
 * Get players for a logged-in team
 * @param {number} userId - ID from token
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