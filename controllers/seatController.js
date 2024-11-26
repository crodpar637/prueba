// eventController.js
const { logMensaje, logErrorSQL } = require("../utils/logger.js");
const Respuesta = require("../utils/respuesta.js");

// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;

// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

// Cargar las definiciones del modelo en sequelize
logMensaje(initModels);
const models = initModels(sequelize);

// Recuperar el modelo seat
const Seat = models.seats;

class SeatController {
  async getSeatsByEventZoneId(req, res) {
    // Implementa la lógica para recuperar los datos de asientos por el event_zone_id
    // Recuperar información que vienen en la ruta '/:event_zone_id'
    const { event_zone_id } = req.params;
    try {
      const seats = await Seat.findAll({
        where: { event_zone_id: event_zone_id },
      });
      if (seats) {
          res.json(Respuesta.exito(seats, "Seats recovered."));
      }
    } catch (error) {
      res
        .status(500)
        .json(Respuesta.error(null, "Error getting seats:" + event_zone_id));
    }
  }
}

module.exports = new SeatController();
