import PlayerStats from "../models/playerStats.js";
import Player from "../models/player.js";
import Match from "../models/match.js";

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
          shotsOnTarget: playerStats.shotsOnTarget + (stats.shotsOnTarget || 0),
          passAccuracy: stats.passAccuracy || playerStats.passAccuracy, // Replace pass accuracy
          foulsCommitted: playerStats.foulsCommitted + (stats.foulsCommitted || 0),
          yellowCards: playerStats.yellowCards + (stats.yellowCards || 0),
          redCards: playerStats.redCards + (stats.redCards || 0),
          tacklesMade: playerStats.tacklesMade + (stats.tacklesMade || 0),
          interceptions: playerStats.interceptions + (stats.interceptions || 0),
          clearances: playerStats.clearances + (stats.clearances || 0),
          blocks: playerStats.blocks + (stats.blocks || 0),
          duelsWon: playerStats.duelsWon + (stats.duelsWon || 0),
          aerialDuelsWon: playerStats.aerialDuelsWon + (stats.aerialDuelsWon || 0),
          keyPasses: playerStats.keyPasses + (stats.keyPasses || 0),
          dribblesCompleted: playerStats.dribblesCompleted + (stats.dribblesCompleted || 0),
          chancesCreated: playerStats.chancesCreated + (stats.chancesCreated || 0),
          offsides: playerStats.offsides + (stats.offsides || 0),
          shotAccuracy: stats.shotAccuracy || playerStats.shotAccuracy, // Replace shot accuracy
          crossesCompleted: playerStats.crossesCompleted + (stats.crossesCompleted || 0),
          savesMade: playerStats.savesMade + (stats.savesMade || 0),
          cleanSheets: playerStats.cleanSheets + (stats.cleanSheets || 0),
          penaltiesSaved: playerStats.penaltiesSaved + (stats.penaltiesSaved || 0),
          goalsConceded: playerStats.goalsConceded + (stats.goalsConceded || 0),
          savePercentage: stats.savePercentage || playerStats.savePercentage, // Replace save percentage
          distanceCovered: playerStats.distanceCovered + (stats.distanceCovered || 0),
          sprints: playerStats.sprints + (stats.sprints || 0),
          touches: playerStats.touches + (stats.touches || 0),
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

// Get Stats for a Player
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