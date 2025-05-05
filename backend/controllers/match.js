import Match from "../models/match.js";
import PlayerMatch from "../models/playerMatch.js";
import PlayerStats from "../models/playerStats.js";
import { Op } from "sequelize";

import Team from "../models/team.js";
import Player from "../models/player.js";

export const addMatch = async (req, res) => {
  const { homeTeamId, awayTeamId, homeTeamScore, awayTeamScore, matchDate, goalTimestamps, players } = req.body;

  try {
    const match = await Match.create({
      homeTeamId,
      awayTeamId,
      homeTeamScore,
      awayTeamScore,
      matchDate,
      goalTimestamps,
    });

    if (players && players.length > 0) {
      const playerMatches = players.map((playerId) => ({
        playerId,
        matchId: match.id,
      }));
      await PlayerMatch.bulkCreate(playerMatches);
    }

    res.status(201).json({ message: "Match added successfully", match });
  } catch (error) {
    console.error("Error adding match:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMatchesForTeam = async (req, res) => {
  const { teamId } = req.params;

  try {
    const matches = await Match.findAll({
      where: {
        [Op.or]: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
      },
      include: [
        { model: Team, as: "homeTeam", attributes: ["name"] },
        { model: Team, as: "awayTeam", attributes: ["name"] },
      ],
    });

    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching matches for team:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMatchesForPlayer = async (req, res) => {
  const { playerId } = req.params;

  try {
    const playerMatches = await PlayerMatch.findAll({
      where: { playerId },
      include: [
        {
          model: Match,
          include: [
            { model: Team, as: "homeTeam", attributes: ["name"] },
            { model: Team, as: "awayTeam", attributes: ["name"] },
          ],
        },
      ],
    });

    res.status(200).json(playerMatches);
  } catch (error) {
    console.error("Error fetching matches for player:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};