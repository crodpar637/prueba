// locationController.js
const { logMensaje,logErrorSQL } = require('../utils/logger.js');
const Respuesta = require('../utils/respuesta.js');

// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require('../config/sequelize.js');

// Cargar las definiciones del modelo en sequelize
logMensaje(initModels);
const models = initModels(sequelize);

// Recuperar el modelo location
const Location = models.locations;
const Zone = models.zones;

class LocationController {

    async getAllLocation(req, res) {
        // Implementa la lógica para recuperar los datos de todos los locations
        try {
            // const locations = await Location.findAll();
            const locations = await Location.findAll({
                include: {
                  model: Zone, // Incluye las zonas relacionadas
                  as: "zones",
                //   order: [['zone_id', 'ASC']], // Ordena por zone_id de forma ascendente
                  attributes: ['zone_id', 'name', 'num_rows', 'seats_per_row'] // Solo selecciona las columnas necesarias
                },
                order: [[sequelize.col('zones.zone_id'), 'ASC']],
              });
            res.json(Respuesta.exito(locations, 'Datos de locations recuperados'));
        } catch (error) {
            logMensaje(error);
            res.status(500).json(Respuesta.error(null, 'Error al recuperar los datos:' + req.originalUrl));
        }
    };

    async getLocationById(req, res) {
        // Implementa la lógica para recuperar los datos de un location por su id
        // Recuperar información que vienen en la ruta '/:id'
        const { id } = req.params;
        try {
            const location = await Location.findByPk(id);
            if (location) {
                res.json(Respuesta.exito(location, 'Location recuperado'));
            } else {
                res.status(404).json(Respuesta.error(null, 'Location no encontrado'));
            }
        } catch (error) {
            res.status(500).json(Respuesta.error(null, 'Error al obtener el location'));
        }
    };

}

module.exports = new LocationController();
