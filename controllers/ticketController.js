// ticketController.js
const { logMensaje, logErrorSQL } = require("../utils/logger.js");
const Respuesta = require("../utils/respuesta.js");

// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;

// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");
const { Op } = require("sequelize");

// Cargar las definiciones del modelo en sequelize
logMensaje(initModels);
const models = initModels(sequelize);

// Recuperar los modelos a utilizar
const Ticket = models.tickets;
const Seat = models.seats;
const Event = models.events;
const EventZone = models.event_zones;
const Location = models.locations;
const Zone = models.zones;
const User = models.users;
const EventImage = models.event_images;

class TicketController {
  async getTicketByTicketId(req, res) {
    // Implementa la lógica para recuperar los datos necesarios para mostrar un ticket

    // Recuperar el id_ticket
    const { ticket_id } = req.params;

    try {
      // Realizar la consulta con las relaciones necesarias para mostrar
      // toda la información que se imprime en un ticket
      const ticket = await Ticket.findByPk(ticket_id, {
        include: [
          {
            model: User,
            as: "user",
          },
          {
            model: Seat,
            as: "seat",
            include: [
              {
                model: EventZone,
                as: "event_zone",
                include: [
                  {
                    model: Event,
                    as: "event",
                    include: [
                      {
                        model: Location,
                        as: "location",
                      },
                      {
                        model: EventImage,
                        as: "event_images",
                      },
                    ],
                  },
                  {
                    model: Zone,
                    as: "zone",
                  },
                ],
              },
            ],
          },
        ],
      });

      if (ticket) {
        // Borrar la password para que no viaje al frontend
        ticket.user.password = "";
        res.status(200).json(Respuesta.exito(ticket, "Ticket recovered."));
      } else {
        // Enviar los datos
        res.status(404).json(Respuesta.error(null, "Ticket not found."));
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
      res
        .status(500)
        .json(Respuesta.error(null, "Server error fetching ticket."));
    }
  }

  async getTicketsSoldReport(req, res) {
    try {
      const ticketsSold = await EventZone.findAll({
        attributes: [
          [
            sequelize.fn("count", sequelize.col("seats.seat_id")),
            "value",
          ], // Cuenta los registros de asientos para cada zona
          "ticket_price",
          "event_zone_id",
        ],
        include: [
          {
            model: Event,
            as: "event",
            attributes: ["event_id", "event_date", "event_time", "name"],
          },
          {
            model: Zone,
            as: "zone",
            attributes: ["name"],
          },
          {
            model: Seat,
            as: "seats",
            attributes: [], // Solo usamos esto para contar, no necesitamos seleccionar atributos
          },
        ],
        group: ["event_zones.event_zone_id"],
        order: [["event_id", "ASC"]],
      });

      res
        .status(200)
        .json(Respuesta.exito(ticketsSold, "Sold tickets data recovered."));
    } catch (error) {
      console.error("Error fetching sold ticket data:", error);
      res
        .status(500)
        .json(Respuesta.error(null, "Server error fetching sold ticket data."));
    }
  }
}

module.exports = new TicketController();
