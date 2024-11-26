var DataTypes = require("sequelize").DataTypes;
var _event_images = require("./eventImages");
var _event_zones = require("./eventZones");
var _events = require("./events");
var _location_images = require("./locationImages");
var _locations = require("./locations");
var _payments = require("./payments");
var _seats = require("./seats");
var _tickets = require("./tickets");
var _users = require("./users");
var _zones = require("./zones");

function initModels(sequelize) {
  var event_images = _event_images(sequelize, DataTypes);
  var event_zones = _event_zones(sequelize, DataTypes);
  var events = _events(sequelize, DataTypes);
  var location_images = _location_images(sequelize, DataTypes);
  var locations = _locations(sequelize, DataTypes);
  var payments = _payments(sequelize, DataTypes);
  var seats = _seats(sequelize, DataTypes);
  var tickets = _tickets(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var zones = _zones(sequelize, DataTypes);

  seats.belongsTo(event_zones, { as: "event_zone", foreignKey: "event_zone_id"});
  event_zones.hasMany(seats, { as: "seats", foreignKey: "event_zone_id"});
  event_images.belongsTo(events, { as: "event", foreignKey: "event_id"});
  events.hasMany(event_images, { as: "event_images", foreignKey: "event_id"});
  event_zones.belongsTo(events, { as: "event", foreignKey: "event_id"});
  events.hasMany(event_zones, { as: "event_zones", foreignKey: "event_id"});
  events.belongsTo(locations, { as: "location", foreignKey: "location_id"});
  locations.hasMany(events, { as: "events", foreignKey: "location_id"});
  location_images.belongsTo(locations, { as: "location", foreignKey: "location_id"});
  locations.hasMany(location_images, { as: "location_images", foreignKey: "location_id"});
  zones.belongsTo(locations, { as: "location", foreignKey: "location_id"});
  locations.hasMany(zones, { as: "zones", foreignKey: "location_id"});
  tickets.belongsTo(payments, { as: "payment", foreignKey: "payment_id"});
  payments.hasMany(tickets, { as: "tickets", foreignKey: "payment_id"});
  tickets.belongsTo(seats, { as: "seat", foreignKey: "seat_id"});
  seats.hasMany(tickets, { as: "tickets", foreignKey: "seat_id"});
  events.belongsTo(users, { as: "created_by_user", foreignKey: "created_by"});
  users.hasMany(events, { as: "events", foreignKey: "created_by"});
  payments.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(payments, { as: "payments", foreignKey: "user_id"});
  tickets.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(tickets, { as: "tickets", foreignKey: "user_id"});
  event_zones.belongsTo(zones, { as: "zone", foreignKey: "zone_id"});
  zones.hasMany(event_zones, { as: "event_zones", foreignKey: "zone_id"});

  return {
    event_images,
    event_zones,
    events,
    location_images,
    locations,
    payments,
    seats,
    tickets,
    users,
    zones,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
