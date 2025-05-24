import PlayerStats from "../models/playerStats.js";
import Player from "../models/player.js";
import Match from "../models/match.js";
import User from "../models/user.js"; 
import Team from "../models/team.js";

import { sequelize } from "../config/database.js";

// Add or Update Player Stats
export const addOrUpdatePlayerStats = async (req, res) => {
  const { playerId, matchId, stats } = req.body;

  try {
    // Check if stats already exist for the player in the match
    let playerStats = await PlayerStats.findOne({ where: { playerId, matchId } });

    if (playerStats) {
      // Replace the existing stats with the new stats
      playerStats = await playerStats.update({
        minutesPlayed: stats.minutesPlayed || 0,
        goalsScored: stats.goalsScored || 0,
        assists: stats.assists || 0,
        yellowCards: stats.yellowCards || 0,
        redCards: stats.redCards || 0,
        rating: stats.rating || 0,
        // Add other stats fields as needed
      });
      return res.status(200).json({ message: "Player stats updated successfully", playerStats });
    }

    // Create new stats if they don't exist
    const newStats = await PlayerStats.create({ playerId, matchId, ...stats });
    res.status(201).json({ message: "Player stats added successfully", playerStats: newStats });
  } catch (error) {
    console.error("Error editing player stats:", error);
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

export const deletePlayerStats = async (req, res) => {
  const { playerId, matchId } = req.params; // Use URL params

  try {
    // Find the team managed by the logged-in user
    const team = await Team.findOne({ where: { userId: req.userId } });
    if (!team) {
      return res.status(403).json({ message: "Unauthorized: Team not found" });
    }

    // Find the player and ensure they belong to this team
    const player = await Player.findOne({ where: { id: playerId, club_team: team.name } });
    if (!player) {
      return res.status(403).json({ message: "Unauthorized: Player not in your team" });
    }

    // Delete the stats
    const deleted = await PlayerStats.destroy({
      where: { playerId, matchId },
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Player stats not found" });
    }

    res.status(200).json({ message: "Player stats deleted successfully" });
  } catch (error) {
    console.error("Error deleting player stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getTeamPlayersStatsSummary = async (req, res) => {
  try {
    // Find the team managed by the logged-in user
    const team = await Team.findOne({ where: { userId: req.userId } });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Get all players in this team
    const players = await Player.findAll({
      where: { club_team: team.name },
      include: [
        {
          model: User,
          attributes: ["first_name", "last_name"]
        }
      ]
    });

    // Get stats for all players in this team
    const stats = await PlayerStats.findAll({
      where: { playerId: players.map(p => p.id) },
      attributes: [
        "playerId",
        [sequelize.fn("AVG", sequelize.col("rating")), "averageRating"],
        [sequelize.fn("SUM", sequelize.col("goalsScored")), "totalGoals"],
        [sequelize.fn("SUM", sequelize.col("assists")), "totalAssists"],
      ],
      group: ["playerId"],
      raw: true,
    });

    // Merge player info with stats
    const summary = players.map(player => {
      const stat = stats.find(s => s.playerId === player.id) || {};
      return {
        playerId: player.id,
        name: `${player.User.first_name} ${player.User.last_name}`,
        averageRating: Number(stat.averageRating) || 0,
        totalGoals: Number(stat.totalGoals) || 0,
        totalAssists: Number(stat.totalAssists) || 0,
      };
    });

    // Sort by averageRating, then goals, then assists
    summary.sort((a, b) =>
      b.averageRating - a.averageRating ||
      b.totalGoals - a.totalGoals ||
      b.totalAssists - a.totalAssists
    );

    res.status(200).json(summary);
  } catch (error) {
    console.error("Error fetching team player stats summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getPlayerAnalytics = async (req, res) => {
  try {
    // Find the player's ID from the logged-in user
    const player = await Player.findOne({ where: { userId: req.userId } });
    if (!player) return res.status(404).json({ message: "Player not found" });

    // Aggregate stats by match date
    const stats = await PlayerStats.findAll({
      where: { playerId: player.id },
      attributes: [
        [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
        [sequelize.fn("SUM", sequelize.col("goalsScored")), "goals"],
        [sequelize.fn("SUM", sequelize.col("assists")), "assists"],
        [sequelize.fn("SUM", sequelize.col("minutesPlayed")), "minutes"],
        [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
      ],
      group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
      order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
      raw: true,
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};