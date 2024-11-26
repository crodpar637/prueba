import { expect } from "chai";
import request from "supertest";
import app from "../index.js";

describe("EventZonesController", () => {
  describe("GET /api/eventZones/event/:event_id", () => {
    it("debería recuperar todas las zonas de un evento", async () => {
      const res = await request(app)
        .get("/api/eventZones/event/21")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body).to.have.property("ok");
      expect(res.body.ok).to.be.true; // Verifica que `ok` sea `true`
      expect(res.body).to.have.property("mensaje");
      expect(res.body.datos).to.be.an("array");
      expect(res.body.datos.length).to.be.above(0);
    });

    it("debería devolver 404 si el evento no tiene zonas asociadas", async () => {
      const res = await request(app)
        .get("/api/eventZones/event/999") // Reemplaza con un ID que no exista
        .expect("Content-Type", /json/)
        .expect(404);

      expect(res.body).to.have.property("ok");
      expect(res.body.ok).to.be.false; //
      expect(res.body).to.have.property("mensaje");
      expect(res.body)
        .to.have.property("mensaje")
        .that.includes("EventZones not found");
    });
  });

  describe("GET /api/eventZones/:event_zone_id", () => {
    it("debería recuperar los detalles para un event_zone_id", async () => {
      const res = await request(app)
        .get("/api/eventZones/44")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body).to.have.property("ok");
      expect(res.body.ok).to.be.true; // Verifica que `ok` sea `true`
      expect(res.body).to.have.property("mensaje");
      expect(res.body)
        .to.have.property("mensaje")
        .that.includes("Event zone detail recovered.");
    });

    it("debería devolver 500 si el event_zone_id no existe", async () => {
      const res = await request(app)
        .get("/api/eventZones/999") // Reemplaza con un ID que no exista
        .expect("Content-Type", /json/)
        .expect(500);

      expect(res.body).to.have.property("ok");
      expect(res.body.ok).to.be.false; // Verifica que `ok` sea `true`
      expect(res.body)
        .to.have.property("mensaje")
        .that.includes("Error getting event zone detail");
    });
  });
});
