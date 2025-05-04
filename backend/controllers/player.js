import { Op, fn, col, where as seqWhere, literal } from "sequelize";
import Player from "../models/player.js";
import Team from "../models/team.js";
import User from "../models/user.js";

export const getFilteredPlayersForScout = async (req, res) => {
  try {
    const query = req.query;
    const where = {};

    // 🔎 Age filter via TIMESTAMPDIFF(YEAR, yob, CURDATE()) = age
    if (query.age) {
      where[Op.and] = [
        ...(where[Op.and] || []),
        seqWhere(
          fn("TIMESTAMPDIFF", literal("YEAR"), col("yob"), fn("CURDATE")),
          parseInt(query.age)
        ),
      ];
    }

    // 📌 Position filter (case-insensitive)
    if (query.position) {
      where.position = { [Op.like]: `%${query.position}%` }; // Use LIKE for MySQL
    }

    // 🏟️ Club filter (partial, case-insensitive)
    if (query.club) {
      where.club_team = { [Op.like]: `%${query.club}%` }; // Use LIKE for MySQL
    }

    // // ⭐ Endorsements filter
    // if (query.endorsements !== undefined) {
    //   where.endorsements = { [Op.gte]: parseInt(query.endorsements) };
    // }

    // // 📹 Video views filter
    // if (query.videoViews !== undefined) {
    //   where.videoViews = { [Op.gte]: parseInt(query.videoViews) };
    // }

    const players = await Player.findAll({
      where,
      include: [
        { model: Team, attributes: ["name", "county", "team_level"] },
        { model: User, attributes: ["first_name", "last_name", "email"] },
      ],
    });

    if (!players.length) {
      return res.status(404).json({ message: "No players found" });
    }

    return res.status(200).json(players);
  } catch (error) {
    console.error("Error fetching player information:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};