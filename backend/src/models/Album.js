const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Album = sequelize.define(
  "Album",
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
    bgColor: {
      type: DataTypes.STRING(20), // e.g. "#D10000"
      allowNull: false,
    },
  },
  {
    tableName: "albums",
    timestamps: true,
  }
);

module.exports = Album;
