import { expect } from "chai";
import request from "supertest";
import app from "../index.js"; // Ajusta la ruta si es necesario

// Tests para TicketController
describe("TicketController API", () => {

  // Test para `getTicketByTicketId`
  describe("GET /api/tickets/:ticket_id", () => {
    it("should return a ticket with associated information", async () => {
      const ticketId = 25; // Usa un ticket_id existente para el test
      const res = await request(app)
        .get(`/api/tickets/${ticketId}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.datos).to.be.an("object");
      expect(res.body.datos).to.have.property("ticket_id");
      expect(res.body.datos).to.have.property("user");
      expect(res.body.datos.user).to.have.property("user_id");
      expect(res.body.mensaje).to.equal("Ticket recovered.");
    });

    it("should return a 404 error if the ticket is not found", async () => {
      const ticketId = -1; // Usa un ticket_id que no exista en la base de datos
      const res = await request(app)
        .get(`/api/tickets/${ticketId}`)
        .expect("Content-Type", /json/)
        .expect(404);

      expect(res.body.datos).to.be.null;
      expect(res.body.mensaje).to.equal("Ticket not found.");
    });

    // it("should return a 500 error if there is a server issue", async () => {
    //   // Puedes simular este caso forzando un error en la consulta de base de datos o
    //   // cambiando el `ticketId` a un valor no válido, dependiendo de tu implementación
    //   const ticketId = "invalid"; // Usa un id no válido para forzar un error
    //   const res = await request(app)
    //     .get(`/api/tickets/${ticketId}`)
    //     .expect("Content-Type", /json/)
    //     .expect(500);

    //   expect(res.body.datos).to.be.null;
    //   expect(res.body.mensaje).to.equal("Server error fetching ticket.");
    // });
  });
});
