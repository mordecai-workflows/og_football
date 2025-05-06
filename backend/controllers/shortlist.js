import { Shortlist, ShortlistPlayer } from "../models/shortlist.js";
import Player from "../models/player.js";
import User from "../models/user.js";

// Create a new shortlist
export const createShortlist = async (req, res) => {
  const { name } = req.body;
  const scoutId = req.userId;

  try {
    const shortlist = await Shortlist.create({ name, scoutId });
    res.status(201).json({ message: "Shortlist created successfully", shortlist });
  } catch (error) {
    console.error("Error creating shortlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a player to a shortlist
export const addPlayerToShortlist = async (req, res) => {
  const { shortlistId, playerId } = req.body;

  try {
    // Check if the player is already in the shortlist
    const existingEntry = await ShortlistPlayer.findOne({
      where: { shortlistId, playerId },
    });

    if (existingEntry) {
      return res.status(409).json({ message: "Player is already in the shortlist" });
    }

    // Add the player to the shortlist
    const shortlistPlayer = await ShortlistPlayer.create({ shortlistId, playerId });
    res.status(201).json({ message: "Player added to shortlist", shortlistPlayer });
  } catch (error) {
    console.error("Error adding player to shortlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all shortlists for a scout
export const getShortlists = async (req, res) => {
  const scoutId = req.userId;

  try {
    const shortlists = await Shortlist.findAll({
      where: { scoutId },
      include: [
        {
          model: ShortlistPlayer,
          include: [
            {
              model: Player,
              attributes: ["id", "position", "club_team", "county", "height", "weight", "preferred_foot"],
            },
          ],
        },
      ],
    });

    res.status(200).json(shortlists);
  } catch (error) {
    console.error("Error fetching shortlists:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove a player from a shortlist
export const removePlayerFromShortlist = async (req, res) => {
  const { shortlistId, playerId } = req.body;

  try {
    const result = await ShortlistPlayer.destroy({
      where: { shortlistId, playerId },
    });

    if (!result) {
      return res.status(404).json({ message: "Player not found in shortlist" });
    }

    res.status(200).json({ message: "Player removed from shortlist" });
  } catch (error) {
    console.error("Error removing player from shortlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a shortlist and all associated players
export const deleteShortlist = async (req, res) => {
  const { shortlistId } = req.body;

  try {
    // Delete the shortlist and all associated players
    const result = await Shortlist.destroy({
      where: { id: shortlistId },
    });

    if (!result) {
      return res.status(404).json({ message: "Shortlist not found" });
    }

    res.status(200).json({ message: "Shortlist deleted successfully" });
  } catch (error) {
    console.error("Error deleting shortlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};