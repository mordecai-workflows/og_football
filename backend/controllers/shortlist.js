import Shortlist from "../models/shortlist.js";
import Player from "../models/player.js";
import User from "../models/user.js";

export const addPlayerToShortlist = async (req, res) => {
  const { playerId } = req.body;
  const scoutId = req.userId; // Extracted from middleware

  console.log(`player: ${playerId} scout: ${scoutId}`);

  try {
    // Check if the player is already shortlisted
    const existingShortlist = await Shortlist.findOne({
      where: { scoutId, playerId },
    });

    if (existingShortlist) {
      return res.status(409).json({ message: "Player is already shortlisted" });
    }

    // Add the player to the shortlist
    const shortlist = await Shortlist.create({ scoutId, playerId });
    res.status(201).json({
      message: "Player added to shortlist",
      playerId, // Include the playerId in the response
      shortlist,
    });
  } catch (error) {
    console.error("Error adding player to shortlist:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removePlayerFromShortlist = async (req, res) => {
  const { playerId } = req.params;
  const scoutId = req.userId; // Extracted from middleware

  try {
    const result = await Shortlist.destroy({
      where: { scoutId, playerId },
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

export const getShortlistedPlayers = async (req, res) => {
  const scoutId = req.userId; // Extracted from middleware

  try {
    const shortlistedPlayers = await Shortlist.findAll({
      where: { scoutId },
      include: [
        {
          model: Player,
          attributes: [
            "id",
            "position",
            "club_team",
            "county",
            "height",
            "weight",
            "preferred_foot",
          ],
        },
        {
          model: User,
          attributes: ["first_name", "last_name", "email"],
        },
      ],
    });

    res.status(200).json(shortlistedPlayers);
  } catch (error) {
    console.error("Error fetching shortlisted players:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
