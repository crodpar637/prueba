const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('seats', {
    seat_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    event_zone_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'event_zones',
        key: 'event_zone_id'
      }
    },
    row_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    seat_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('available','occupied'),
      allowNull: false,
      defaultValue: "available"
    }
  }, {
    sequelize,
    tableName: 'seats',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "seat_id" },
        ]
      },
      {
        name: "unique_seat",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "event_zone_id" },
          { name: "row_number" },
          { name: "seat_number" },
        ]
      },
    ]
  });
};
