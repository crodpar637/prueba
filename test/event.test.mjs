import { expect } from "chai"; // Importa `expect` desde `chai`
import request from "supertest";
import app from "../index.js"; // Ajusta la ruta si es necesario

describe("POST /api/events/", () => {
  it("should create an event without image files", async () => {
    // Generar array de objetos { zone_id, ticket_price }
    const prices = [
      { zone_id: 1, ticket_price: 50 },
      { zone_id: 2, ticket_price: 40 },
      { zone_id: 3, ticket_price: 30 },
    ];

    const response = await request(app)
      .post("/api/events/")
      .field("name", "event_name_for_test")
      .field("description", "event_description_for_test")
      .field("event_date", new Date().toISOString().split('T')[0]) // "YYYY-MM-DD")
      .field("event_time", new Date().toLocaleTimeString('en-GB'))
      .field("location_id", 1)
      .field("prices", JSON.stringify(prices))
      .attach("../public/assets/images/events/test1.jpg")
      .attach("../public/assets/images/events/test2.jpg")
      .set("Content-Type", "multipart/form-data")
      .expect("Content-Type", /json/)
      .expect(200);

    console.log(response.body);
    expect(response.body).to.have.property("mensaje", "Event created");
    expect(response.body.datos).to.have.property("event_id");
    expect(response.body.datos.event_id).to.be.a("number");
  });
});

describe("GET /api/events", () => {
  it("should return a list of events", async () => {
    const res = await request(app).get("/api/events");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("object");
    expect(res.body.ok).to.be.true;
    expect(res.body.datos).to.be.an("array");
  });
});

describe("GET /api/next-events", () => {
  it("should return a list of 12 or fewer next events", async () => {
    const res = await request(app).get("/api/events");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("object");
    expect(res.body.ok).to.be.true;
    expect(res.body.datos).to.be.an("array");
    expect(res.body.datos.length).to.be.at.most(12); // Verifica que el array tiene como máximo 12 elementos
  });
});

describe("GET /api/events/:id", () => {
  it("should return a single event by ID", async () => {
    const eventId = 21; // Ajusta el ID según el evento que tengas en tu BD
    const res = await request(app).get(`/api/events/${eventId}`);
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("object");
    expect(res.body.ok).to.be.true;
    expect(res.body.datos).to.have.property("name");
    expect(res.body.datos).to.have.property("location");
    expect(res.body.datos).to.have.property("event_images");
  });

  it("should return 404 if event is not found", async () => {
    const res = await request(app).get("/api/events/9999");
    expect(res.status).to.equal(404);
    expect(res.body.ok).to.be.false;
    expect(res.body.mensaje).to.equal("Event not found.");
  });
});

describe("GET /api/events/search", () => {
  it("should return events matching the search text", async () => {
    const searchText = "Matilda";
    const res = await request(app).get(`/api/events/search?searchText=${searchText}`);
    expect(res.status).to.equal(200);
    expect(res.body.ok).to.be.true;
    expect(res.body.datos).to.be.an("array");
    res.body.datos.forEach(event => {
      expect(event.name.toLowerCase()).to.include(searchText.toLowerCase());
    });
  });

  it("should return 200 with an empty array if no events match", async () => {
    const searchText = "EventoQueNoExiste";
    const res = await request(app).get(`/api/events/search?searchText=${searchText}`);
    expect(res.status).to.equal(200);
    expect(res.body.ok).to.be.true;
    expect(res.body.datos).to.be.an("array").that.is.empty;
  });
});


describe("PATCH /:event_id", () => {
  afterEach(() => {
    sinon.restore(); // Limpia los stubs después de cada test
  });

  it("should update the event status successfully", async () => {
    // Datos simulados
    const event_id = 1;
    const newStatus = "blocked";

    // Stub de actualización del modelo Event
    const updateStub = sinon.stub(Event, "update").resolves([1]); // Simula una actualización exitosa (1 registro afectado)

    const res = await request(app)
      .patch(`/${event_id}`)
      .send({ status: newStatus });

    expect(updateStub.calledOnce).to.be.true;
    expect(updateStub.calledWith({ status: newStatus }, { where: { event_id } })).to.be.true;
    expect(res.status).to.equal(200);
    expect(res.body.ok).to.be.true;
    expect(res.body.mensaje).to.equal("Status updated successfully");
  });

  it("should return an error if the update fails", async () => {
    // Datos simulados
    const event_id = 1;
    const newStatus = "completed";

    // Stub de actualización del modelo Event para simular un error
    const errorMessage = "Database error";
    const updateStub = sinon.stub(Event, "update").throws(new Error(errorMessage));

    const res = await request(app)
      .patch(`/${event_id}`)
      .send({ status: newStatus });

    expect(updateStub.calledOnce).to.be.true;
    expect(updateStub.calledWith({ status: newStatus }, { where: { event_id } })).to.be.true;
    expect(res.status).to.equal(500);
    expect(res.body.ok).to.be.false;
    expect(res.body.mensaje).to.include("Error updating status");
  });
});
