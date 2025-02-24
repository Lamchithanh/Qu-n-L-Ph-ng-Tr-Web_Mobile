import { DataTypes } from "sequelize";
import sequelize from "../../Backend/Database/database.js";

const Room = sequelize.define(
  "Room",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    room_number: {
      type: DataTypes.STRING(20),
      unique: true,
      allowNull: false,
    },
    floor: {
      type: DataTypes.INTEGER,
    },
    area: {
      type: DataTypes.DECIMAL(10, 2),
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM("available", "occupied", "maintenance"),
      defaultValue: "available",
    },
    description: {
      type: DataTypes.TEXT,
    },
    facilities: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: null,
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    review_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    tableName: "rooms",
    timestamps: true,
    paranoid: true,
  }
);

export default Room;
