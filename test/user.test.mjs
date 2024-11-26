import { expect } from "chai"; // Importa `expect` desde `chai`
import request from "supertest";
import app from "../index.js"; // Ajusta la ruta si es necesario

describe("GET /api/users", () => {
  it("should return a list of users", async () => {
    const res = await request(app)
      .get("/api/users")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body.datos).to.be.an("array");
    expect(res.body.datos.length).to.be.above(0);
  });
});

describe("GET /api/users/", () => {
  it("should return an user", async () => {
    const res = await request(app)
      .get("/api/users/9")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body.datos).to.be.an("object");
    expect(res.body.datos.username).to.be.an("string");
  });
});

describe("GET /api/users/:id", () => {
  it("should return 404 for a non-existent user", async () => {
    const nonExistentUserId = 99999; // ID de usuario que no existe
    const res = await request(app)
      .get(`/api/users/${nonExistentUserId}`)
      .expect("Content-Type", /json/)
      .expect(404); // Espera un código de estado 404

    // Verifica que la respuesta tenga la propiedad `ok` y que su valor sea `false`
    expect(res.body).to.have.property("ok");
    expect(res.body.ok).to.be.false; // Verifica que `ok` sea `false`
    expect(res.body).to.have.property("mensaje"); // Verifica el mensaje de error
    expect(res.body.mensaje).to.equal("User not found");
  });
});

describe("POST /api/users/signin", () => {
  it("should signin a user", async () => {
    const credentials = {
      email: "julia@gmail.com",
      password: "juliarl",
    };

    const res = await request(app)
      .post("/api/users/signin")
      .send(credentials)
      .expect("Content-Type", /json/)
      .expect(200);

    // Verifica la respuesta
    expect(res.body).to.have.property("ok");
    expect(res.body.ok).to.be.true; // Verifica que `ok` sea `true` para credenciales válidas
    expect(res.body.datos).to.have.property("token"); // Por ejemplo, si esperas un token de autenticación
    expect(res.body.datos.token).to.be.a("string"); // Verifica que el token sea una cadena
  });
  it("should return an error response for invalid email", async () => {
    const credentials = {
      email: "not_exist@gmail.com",
      password: "julia",
    };

    const res = await request(app)
      .post("/api/users/signin")
      .send(credentials)
      .expect("Content-Type", /json/)
      .expect(401);

    // Verifica la respuesta
    expect(res.body).to.have.property("ok");
    expect(res.body.ok).to.be.false; // Verifica que `ok` sea `false` para credenciales no válidas
    expect(res.body).to.have.property("mensaje");
    expect(res.body.mensaje).to.equal("Invalid email"); // Ajusta el mensaje según tu implementación
  });
  it("should return an error response for invalid password", async () => {
    const credentials = {
      email: "anabel@gmail.com",
      password: "not_valid",
    };

    const res = await request(app)
      .post("/api/users/signin")
      .send(credentials)
      .expect("Content-Type", /json/)
      .expect(401);

    // Verifica la respuesta
    expect(res.body).to.have.property("ok");
    expect(res.body.ok).to.be.false; // Verifica que `ok` sea `false` para credenciales no válidas
    expect(res.body).to.have.property("mensaje");
    expect(res.body.mensaje).to.equal("Invalid password"); // Ajusta el mensaje según tu implementación
  });

  it("should return an error response for user blocked", async () => {
    const credentials = {
      email: "1730048651179@gmail.com",
      password: "password",
    };

    const res = await request(app)
      .post("/api/users/signin")
      .send(credentials)
      .expect("Content-Type", /json/)
      .expect(401);

    // Verifica la respuesta
    expect(res.body).to.have.property("ok");
    expect(res.body.ok).to.be.false; // Verifica que `ok` sea `false` para credenciales no válidas
    expect(res.body).to.have.property("mensaje");
    expect(res.body.mensaje).to.equal("User is blocked"); // Ajusta el mensaje según tu implementación
  });
});

describe("POST /api/users/signup", () => {
  it("should signup an user", async () => {
    const data = {
      username: "username",
      email: Date.now().toString() + "@gmail.com",
      password: "password",
      first_name: "first_name",
      last_name: "last_name",
    };

    const res = await request(app)
      .post("/api/users/signup")
      .send(data)
      .expect("Content-Type", /json/)
      .expect(200);

    // Verifica la respuesta
    expect(res.body).to.have.property("ok");
    expect(res.body.ok).to.be.true; // Verifica que `ok` sea `true`
    expect(res.body).to.have.property("mensaje"); // Compruebo la propiedad mensaje
    expect(res.body.mensaje).to.be.a("string"); // Verifica que el mensaje sea una cadena
    expect(res.body.mensaje).to.equal("User created");
  });

  it("should return an error response for existing email", async () => {
    const data = {
      username: "username",
      email: "julia@gmail.com",
      password: "password",
      first_name: "first_name",
      last_name: "last_name",
    };

    const res = await request(app)
      .post("/api/users/signup")
      .send(data)
      .expect("Content-Type", /json/)
      .expect(500);

    // Verifica la respuesta
    expect(res.body).to.have.property("ok");
    expect(res.body.ok).to.be.false; // Verifica que `ok` sea `false` para email existente
    expect(res.body).to.have.property("mensaje"); // Compruebo la propiedad mensaje
    expect(res.body.mensaje).to.be.a("string"); // Verifica que el mensaje sea una cadena
    expect(res.body.mensaje).to.equal("Error creating user");
  });
});
