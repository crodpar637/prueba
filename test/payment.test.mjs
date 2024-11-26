import { expect } from "chai";
import request from "supertest";
import app from "../index.js"; // Ajusta la ruta si es necesario

// Tests para PaymentController
describe("PaymentController API", () => {

  // Test para `getPaymentsByUserId`
  describe("GET /api/payments/user/:user_id", () => {
    it("should return a list of payments for a specific user", async () => {
      const userId = 14; // Define un user_id válido para el test
      const res = await request(app)
        .get(`/api/payments/user/${userId}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.datos).to.be.an("array");
      // Puedes añadir más validaciones si tienes datos específicos esperados
      expect(res.body.mensaje).to.equal("Payments recovered.");
    });

    it("should return an empty array if no payments are found", async () => {
      const userId = 9999; // Usa un user_id que no exista en la base de datos
      const res = await request(app)
        .get(`/api/payments/user/${userId}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.datos).to.be.an("array").that.is.empty;
      expect(res.body.mensaje).to.equal("No payments found for this user.");
    });
  });

  // Test para `createPayment`
  // describe("POST /api/payments", () => {
  //   it("should create a payment with associated tickets and seats", async () => {
  //     const paymentData = {
  //       user_id: 14,
  //       total_amount: 100,
  //       seats: [
  //         { event_zone_id: 73, row_number: 1, seat_number: 3, price: 40 },
  //         { event_zone_id: 73, row_number: 1, seat_number: 4, price: 40 } // Cambiar asientos para repetir prueba
  //       ]
  //     };

  //     const res = await request(app)
  //       .post("/api/payments")
  //       .send(paymentData)
  //       .expect("Content-Type", /json/)
  //       .expect(200);

  //     expect(res.body.datos).to.have.property("payment_id");
  //     expect(res.body.mensaje).to.equal("Payment created");
  //   });

  //   it("should return an error if required fields are missing", async () => {
  //     const invalidData = { user_id: 1 }; // Falta el campo total_amount

  //     const res = await request(app)
  //       .post("/api/payments")
  //       .send(invalidData)
  //       .expect("Content-Type", /json/)
  //       .expect(500);

  //     expect(res.body.mensaje).to.equal("Error creating payment");
  //   });
  // });
});
