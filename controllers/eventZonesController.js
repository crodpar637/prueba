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

// Recuperar el modelo event
const Zone = models.zones;
const EventZone = models.event_zones;
const Event = models.events;
const Location = models.locations;

class EventZonesController {
  async getEventZonesByEventId(req, res) {
    // Implementa la lógica para recuperar los datos de un event por su id
    // Recuperar información que vienen en la ruta '/:id'
    const { event_id } = req.params;
    try {
      const eventZones = await EventZone.findAll({
        where: { event_id: event_id },
        include: [
          {
            model: Zone, // Incluir el modelo Zone
            as: "zone",
            attributes: ["name", "num_rows", "seats_per_row"],
          },
        ],
      });
      if (eventZones) {
        if (eventZones.length > 0) {
          res.json(Respuesta.exito(eventZones, "EventZones recovered."));
        } else {
          res
            .status(404)
            .json(Respuesta.error(null, "EventZones not found:" + event_id));
        }
      }
    } catch (error) {
      res
        .status(500)
        .json(Respuesta.error(null, "Error getting event zones:" + event_id));
    }
  }

  async getEventZoneDetails(req, res) {
    // Implementa la lógica para recuperar los datos de la zona de un evento por su id
    // Recuperar información que viene como parámetro de GET
    const { event_zone_id } = req.params;

    try {
      const eventZoneDetails = await EventZone.findByPk(event_zone_id, {
        include: [
          {
            model: Zone, // Incluir el modelo Zone
            as: "zone",
            attributes: ["name", "num_rows", "seats_per_row"],
          },
          {
            model: Event,
            as: "event",
            attributes: ["name", "event_date", "event_time"], // Especifica los campos que deseas recuperar
            include: {
              model: Location,
              as: "location",
              attributes: ["name"], // Especifica los campos que deseas recuperar
            },
          },
        ],
      });

      if (!eventZoneDetails) {
        throw new Error(
          "No se encontraron detalles para el event_zone_id proporcionado."
        );
      }

      // // Formatea los datos que necesitas
      // const result = {
      //   eventName: eventZoneDetails.Event.name,
      //   eventDate: eventZoneDetails.Event.event_date,
      //   eventTime: eventZoneDetails.Event.event_time,
      //   locationName: eventZoneDetails.Event.Location.name,
      //   zoneName: eventZoneDetails.Zone.name,
      //   price: eventZoneDetails.ticket_price,
      // };

      res.json(
        Respuesta.exito(eventZoneDetails, "Event zone detail recovered.")
      );
    } catch (error) {
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            "Error getting event zone detail:" + event_zone_id + " - " + error
          )
        );
      logMensaje(
        "Error getting event zone detail:" + event_zone_id + " - " + error
      );
    }
  }
}

module.exports = new EventZonesController();
