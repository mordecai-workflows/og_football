import PlayerStats from "../models/playerStats.js";
import Player from "../models/player.js";
import Match from "../models/match.js";
import User from "../models/user.js"; 

import { sequelize } from "../config/database.js";

// Add or Update Player Stats
export const addOrUpdatePlayerStats = async (req, res) => {
  const { playerId, matchId, stats } = req.body;

  try {
    // Check if stats already exist for the player in the match
    let playerStats = await PlayerStats.findOne({ where: { playerId, matchId } });

    if (playerStats) {
      // Add new stats to the existing stats
      const updatedStats = {
        minutesPlayed: playerStats.minutesPlayed + (stats.minutesPlayed || 0),
        goalsScored: playerStats.goalsScored + (stats.goalsScored || 0),
        assists: playerStats.assists + (stats.assists || 0),
        yellowCards: playerStats.yellowCards + (stats.yellowCards || 0),
        redCards: playerStats.redCards + (stats.redCards || 0),
        rating: stats.rating || playerStats.rating, // Replace rating if provided
        // Add other stats fields as needed
      };

      // Update the stats in the database
      playerStats = await playerStats.update(updatedStats);
      return res.status(200).json({ message: "Player stats updated successfully", playerStats });
    }

    // Create new stats if they don't exist
    const newStats = await PlayerStats.create({ playerId, matchId, ...stats });
    res.status(201).json({ message: "Player stats added successfully", playerStats: newStats });
  } catch (error) {
    console.error("Error adding/updating player stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Stats for a Specific Player
export const getPlayerStats = async (req, res) => {
  const { playerId } = req.params;

  try {
    const stats = await PlayerStats.findAll({
      where: { playerId },
      include: [
        { model: Match, attributes: ["homeTeamId", "awayTeamId", "matchDate"] },
      ],
    });

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching player stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Summary of All Players' Stats
export const getAllPlayersStatsSummary = async (req, res) => {
  try {
    const statsSummary = await PlayerStats.findAll({
      attributes: [
        "playerId",
        [sequelize.fn("SUM", sequelize.col("minutesPlayed")), "totalMinutesPlayed"],
        [sequelize.fn("SUM", sequelize.col("goalsScored")), "totalGoalsScored"],
        [sequelize.fn("SUM", sequelize.col("assists")), "totalAssists"],
        [sequelize.fn("SUM", sequelize.col("yellowCards")), "totalYellowCards"],
        [sequelize.fn("SUM", sequelize.col("redCards")), "totalRedCards"],
        [sequelize.fn("AVG", sequelize.col("rating")), "averageRating"], // Average rating
      ],
      include: [
        {
          model: Player,
          attributes: ["id", "position", "club_team"],
          include: [
            {
              model: User, // Join the User table
              attributes: ["first_name", "last_name"], // Fetch first_name and last_name
            },
            {
              model: Team, // Join the Team table
              attributes: ["name"], // Fetch the team name
              where: { name: req.user.team }, // Filter by the logged-in user's team
            },
          ],
        },
      ],
      group: ["playerId", "Player.id", "Player->User.id", "Player->Team.name"], // Group by playerId, Player, User, and Team details
    });

    res.status(200).json(statsSummary);
  } catch (error) {
    console.error("Error fetching players' stats summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};