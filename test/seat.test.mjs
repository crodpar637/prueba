import { expect } from "chai";
import request from "supertest";
import app from "../index.js"; // Ajusta la ruta si es necesario

describe("SeatController API", () => {
  // Test para `getSeatsByEventZoneId`
  describe("GET /api/seats/:event_zone_id", () => {
    it("should return a list of seats for a specific event zone", async () => {
      const eventZoneId = 62; // Asegúrate de que el ID exista en la base de datos o usa uno válido
      const res = await request(app)
        .get(`/api/seats/${eventZoneId}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(res.body.datos).to.be.an("array");
      expect(res.body.mensaje).to.equal("Seats recovered.");
    });
  });
});
