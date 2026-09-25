const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Song = sequelize.define(
  "Song",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    desc: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT, // Cloudinary URL
      allowNull: false,
    },
    file: {
      type: DataTypes.TEXT, // Cloudinary audio URL
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING(10), // e.g. "3:59"
      allowNull: false,
    },
    album: {
      type: DataTypes.STRING(255),
      defaultValue: "None",
    },
  },
  {
    tableName: "songs",
    timestamps: true,
  }
);

module.exports = Song;
