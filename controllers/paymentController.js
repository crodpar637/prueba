// paymentController.js
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
const Payment = models.payments;
const Ticket = models.tickets;
const Seat = models.seats;
const Event = models.events;
const EventZone = models.event_zones;
const Location = models.locations;
const Zone = models.zones;


class PaymentController {

  async getPaymentsByUserId(req, res) {
    // Implementa la lógica para recuperar los datos de los pagos, los tickets y los asientos asociados

    // Recuperar datos del user_id del que se quieren recuperar los pagos
    const { user_id } = req.params;

    try {
      // Realizar la consulta con las relaciones entre payments, tickets y seats
      const payments = await Payment.findAll({
        where: { user_id },  // Filtrar por el user_id
        include: [
          {
            model: Ticket,
            as: "tickets",
            include: [
              {
                model: Seat,
                as: "seat",
                attributes: ['seat_id', 'event_zone_id', 'row_number', 'seat_number', 'status'],
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
                          }
                        ]
                      },

                      {
                        model: Zone,
                        as: "zone",
                      }
                    ]
                  }
                ]
              }
            ],
            attributes: ['ticket_id', 'purchase_date', 'status', 'price']
          }
        ],
        attributes: ['payment_id', 'total_amount', 'payment_date', 'status'], // Atributos de payments
        order: [['payment_date', 'DESC']]
      });

      // Verificar si se encontraron pagos
      if (!payments.length) {
        res.status(200).json(Respuesta.exito([], 'No payments found for this user.'));
      } else {
        // Enviar los datos 
        res.status(200).json(Respuesta.exito(payments, "Payments recovered."));

      }
    } catch (error) {
      console.error('Error fetching user payments:', error);
      res.status(500).json(Respuesta.error([], 'Server error fetching payments.'));
    }
  }

  async createPayment(req, res) {
    // Implementa la lógica para crear un pago y registrar asientos y tickets

    // Recuperar datos del pago a registrar
    const { user_id, total_amount, seats } = req.body;

    // Inicia la transacción
    const t = await sequelize.transaction();

    try {
      const paymentInsertado = await Payment.create(
        { user_id, total_amount, payment_date: new Date(), status: 'completed' },
        { transaction: t }
      );

      for (let seat of seats) {
        // Por cada asiento 1. Se inserta un asiento 2. Se inserta un ticket
        const seatInsertado = await Seat.create(
          {
            event_zone_id: seat.event_zone_id,
            row_number: seat.row_number,
            seat_number: seat.seat_number,
            status: 'occupied'
          },
          { transaction: t }
        );
        const ticketInsertado = await Ticket.create(
          {
            user_id,
            seat_id: seatInsertado.seat_id,
            payment_id: paymentInsertado.payment_id,
            purchase_date: new Date(),
            price: seat.price,
            status: 'purchased'
          },
          { transaction: t }
        );
      }

      // Confirmar la transacción si todo sale bien
      await t.commit();
      res.json(Respuesta.exito(paymentInsertado, "Payment created"));
    } catch (error) {
      // Revertir la transacción en caso de error
      await t.rollback();
      logMensaje(error);
      res
        .status(500)
        .json(Respuesta.error(error, "Error creating payment"));
    }
  }

}

module.exports = new PaymentController();
