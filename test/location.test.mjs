import { expect } from "chai"; // Importa `expect` desde `chai`
import request from "supertest";
import app from "../index.js"; // Ajusta la ruta si es necesario

describe("GET /api/locations", () => {
  it("should return a list of locations", async () => {
    const res = await request(app)
      .get("/api/locations")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body.datos).to.be.an("array");
    expect(res.body.datos.length).to.be.above(0);
  });
});

describe("GET /api/locations/1", () => {
  it("should return a location", async () => {
    const res = await request(app)
      .get("/api/locations/1")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body.datos).to.be.an("object");
    expect(res.body.datos.name).to.be.an("string");
  });
});
