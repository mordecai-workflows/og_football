import Match from "../models/match.js";
import PlayerMatch from "../models/playerMatch.js";
import Team from "../models/team.js";
import { Op } from "sequelize";

/**
 * Add a new match
 */
export const addMatch = async (req, res) => {
  const { awayTeamId, homeTeamScore, awayTeamScore, matchDate } = req.body;
  const userId = req.userId; // Extract the logged-in user's ID

  try {
    // Find the home team associated with the logged-in user
    const homeTeam = await Team.findOne({ where: { userId } });

    if (!homeTeam) {
      return res.status(404).json({ message: "Home team not found for the logged-in user" });
    }

    // Create the match
    const match = await Match.create({
      homeTeamId: homeTeam.id,
      awayTeamId,
      homeTeamScore,
      awayTeamScore,
      matchDate,
    });

    res.status(201).json({ message: "Match added successfully", match });
  } catch (error) {
    console.error("Error adding match:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Get all matches for the logged-in user's team
 */
export const getAllMatches = async (req, res) => {
  const userId = req.userId; // Extract the logged-in user's ID

  try {
    // Find the team associated with the logged-in user
    const team = await Team.findOne({ where: { userId } });

    if (!team) {
      return res.status(404).json({ message: "Team not found for the logged-in user" });
    }

    // Fetch matches where the team is either the home or away team
    const matches = await Match.findAll({
      where: {
        [Op.or]: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
      },
      include: [
        { model: Team, as: "homeTeam", attributes: ["name"] },
        { model: Team, as: "awayTeam", attributes: ["name"] },
      ],
    });

    if (!matches || matches.length === 0) {
      return res.status(404).json({ message: "No matches found for this team" });
    }

    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Edit a match
 */
export const editMatch = async (req, res) => {
  const { matchId } = req.params;
  const { awayTeamId, homeTeamScore, awayTeamScore, matchDate } = req.body;

  try {
    const match = await Match.findByPk(matchId);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    await match.update({
      awayTeamId,
      homeTeamScore,
      awayTeamScore,
      matchDate,
    });

    res.status(200).json({ message: "Match updated successfully", match });
  } catch (error) {
    console.error("Error editing match:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Delete a match
 */
export const deleteMatch = async (req, res) => {
  const { matchId } = req.params;

  try {
    const match = await Match.findByPk(matchId);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    // Delete associated PlayerMatch records first
    await PlayerMatch.destroy({ where: { matchId } });

    // Delete the match
    await match.destroy();

    res.status(200).json({ message: "Match deleted successfully" });
  } catch (error) {
    console.error("Error deleting match:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};