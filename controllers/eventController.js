// eventController.js
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

// Recuperar el modelo event
const Event = models.events;
const EventImage = models.event_images;
const EventZone = models.event_zones;
const Location = models.locations;

class EventController {
  async updateEventStatus(req, res) {
    const { event_id } = req.params;
    const { status } = req.body;

    try {
      await Event.update(
        { status: status }, // Los campos que deseas actualizar
        { where: { event_id: event_id } } // La condición para encontrar el registro
      );

      console.log("Event_id: ", event_id, "Status: ", status);

      res.json(Respuesta.exito(null, "Status updated successfully"));
    } catch (error) {
      console.error("Error updating status:", error);
      res
        .status(500)
        .json(Respuesta.error(null, "Error updating status:" + error));
    }
  }

  async getAllEvent(req, res) {
    // Implementa la lógica para recuperar los datos de todos los events
    try {
      const events = await Event.findAll({
        order: [["event_date", "ASC"]], // Ordenar por fecha de evento ascendente
        include: [
          {
            model: Location, // Incluir datos de la localización
            as: "location",
            attributes: [
              "name",
              "address",
              "total_capacity",
              "google_maps_url",
              "plan_image_url",
            ],
          },
          {
            model: EventImage, // Incluir las imágenes del evento
            as: "event_images",
            attributes: ["image_url"],
          },
        ],
      });
      res.json(Respuesta.exito(events, "Datos de events recuperados"));
    } catch (error) {
      logMensaje(error);
      res
        .status(500)
        .json(
          Respuesta.error(
            null,
            "Error al recuperar los datos:" + req.originalUrl
          )
        );
    }
  }

  async getEventById(req, res) {
    // Implementa la lógica para recuperar los datos de un event por su id
    // Recuperar información que vienen en la ruta '/:id'
    const { id } = req.params;
    try {
      const event = await Event.findByPk(id, {
        include: [
          {
            model: Location, // Incluir datos de la localización
            as: "location",
            attributes: [
              "name",
              "address",
              "total_capacity",
              "google_maps_url",
              "plan_image_url",
            ],
          },
          {
            model: EventImage, // Incluir las imágenes del evento
            as: "event_images",
            attributes: ["image_url"],
          },
        ],
      });
      if (event) {
        res.status(200).json(Respuesta.exito(event, "Event recovered."));
      } else {
        res.status(404).json(Respuesta.error(null, "Event not found."));
      }
    } catch (error) {
      res.status(500).json(Respuesta.error(null, "Error getting event."));
    }
  }

  async createEvent(req, res) {
    // Implementa la lógica para crear un nuevo event

    // Recuperar datos del nuevo evento
    const { name, description, event_date, event_time, prices, location_id } =
      req.body; // Acceder a otros datos del formulario (nombre del evento)
    const imageFiles = req.files; // Acceder a los archivos subidos
    const zone_prices = JSON.parse(prices);

    // Inicia la transacción
    const t = await sequelize.transaction();

    try {
      const eventInsertado = await Event.create(
        { name, description, event_date, event_time, location_id },
        { transaction: t }
      );

      const eventZonesData = zone_prices.map((item) => ({
        event_id: eventInsertado.event_id,
        zone_id: item.zone_id,
        ticket_price: item.ticket_price,
      }));

      // Insertar múltiples filas
      await EventZone.bulkCreate(eventZonesData, { transaction: t });

      // Procesar las imágenes si existen
      if (imageFiles && imageFiles.length > 0) {
        const imagePaths = imageFiles.map(
          (file) => `/assets/images/events/${file.filename}`
        );

        // Guardar las imágenes en la tabla event_images
        const eventImages = imagePaths.map((imageUrl) => ({
          event_id: eventInsertado.event_id, // ID del evento recién creado
          image_url: imageUrl,
        }));

        // Insertar todas las imágenes en la base de datos
        await EventImage.bulkCreate(eventImages, { transaction: t });
      }
      // Confirmar la transacción si todo sale bien
      await t.commit();
      res.json(Respuesta.exito(eventInsertado, "Event created"));
    } catch (error) {
      // Revertir la transacción en caso de error
      await t.rollback();
      logMensaje(error);
      res
        .status(500)
        .json(Respuesta.error(error, "Error al insertar el event"));
    }
  }

  async updateEvent(req, res) {
    // Implementa la lógica para actualizar un event por su id
    // Recuperar información que vienen en la ruta '/:id'
    const idevent = req.params.id;
  }

  async deleteEvent(req, res) {
    // Implementa la lógica para eliminar un event por su id
    // Recuperar información que vienen en la ruta '/:id'
    const idevent = req.params.id;
  }

  async getNextEvents(req, res) {
    try {
      // Obtener la fecha de hoy
      const today = new Date();

      // Consultar los próximos 12 eventos
      const events = await Event.findAll({
        where: {
          event_date: {
            [Op.gte]: today, // Eventos con fecha mayor o igual a hoy
          },
          status: "active", // Solo eventos con status "active"
        },
        limit: 12, // Limitar a 12 eventos
        order: [["event_date", "ASC"]], // Ordenar por fecha de evento ascendente
        include: [
          {
            model: Location, // Incluir datos de la localización
            as: "location",
            attributes: [
              "name",
              "address",
              "total_capacity",
              "google_maps_url",
              "plan_image_url",
            ],
          },
          {
            model: EventImage, // Incluir las imágenes del evento
            as: "event_images",
            attributes: ["image_url"],
          },
        ],
      });

      // Devolver los eventos como respuesta
      return res
        .status(200)
        .json(Respuesta.exito(events, "Next events recovered"));
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json(Respuesta.error(null, "Error getting next event"));
    }
  }

  async searchEvents(req, res) {
    try {
      // Obtener la fecha de hoy
      const today = new Date();

      // Obtener la cadena de búsqueda
      const searchText = req.query.searchText || "";

      // Consultar los próximos 12 eventos
      const events = await Event.findAll({
        where: {
          event_date: {
            [Op.gte]: today, // Eventos con fecha mayor o igual a hoy
          },
          status: "active", // Solo eventos con status "active"
          [Op.and]: [
            // Usar Op.and para combinar condiciones
            sequelize.where(
              sequelize.fn("LOWER", sequelize.col("events.name")),
              {
                [Op.like]: `%${searchText.toLowerCase()}%`,
              }
            ),
          ],
          // [Op.or]: [
          //   sequelize.where(
          //     sequelize.fn("LOWER", sequelize.col("events.name")),
          //     {
          //       [Op.like]: `%${searchText.toLowerCase()}%`,
          //     }
          //   ),
          //   sequelize.where(
          //     sequelize.fn("LOWER", sequelize.col("events.description")),
          //     {
          //       [Op.like]: `%${searchText.toLowerCase()}%`,
          //     }
          //   ),
          // ],
        },
        order: [["event_date", "ASC"]], // Ordenar por fecha de evento ascendente
        include: [
          {
            model: Location, // Incluir datos de la localización
            as: "location",
            attributes: [
              "name",
              "address",
              "total_capacity",
              "google_maps_url",
              "plan_image_url",
            ],
          },
          {
            model: EventImage, // Incluir las imágenes del evento
            as: "event_images",
            attributes: ["image_url"],
          },
        ],
      });

      // Devolver los eventos como respuesta
      return res
        .status(200)
        .json(Respuesta.exito(events, "Search events succesful"));
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json(Respuesta.error(null, "Error searching events"));
    }
  }
}

module.exports = new EventController();
