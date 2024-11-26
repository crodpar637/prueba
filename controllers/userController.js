// userController.js
const { logMensaje, logErrorSQL } = require("../utils/logger.js");
const Respuesta = require("../utils/respuesta.js");
// Libreria de encriptación para la password
const bcrypt = require("bcrypt");
// Libreria JWT
const jwt = require("jsonwebtoken");
// Recuperar función de inicialización de modelos
const initModels = require("../models/init-models.js").initModels;
// Crear la instancia de sequelize con la conexión a la base de datos
const sequelize = require("../config/sequelize.js");

// Cargar las definiciones del modelo en sequelize
logMensaje(initModels);
const models = initModels(sequelize);

// Recuperar el modelo user
const User = models.users;

class UserController {
  async getAllUser(req, res) {
    // Implementa la lógica para recuperar los datos de todos los users
    try {
      const users = await User.findAll();
      res.json(Respuesta.exito(users, "Datos de users recuperados"));
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

  async getUserById(req, res) {
    // Implementa la lógica para recuperar los datos de un user por su id
    // Recuperar información que vienen en la ruta '/:id'
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (user) {
        res.json(Respuesta.exito(user, "User data recover"));
      } else {
        res.status(404).json(Respuesta.error(null, "User not found"));
      }
    } catch (error) {
      res.status(500).json(Respuesta.error(null, "Error getting user"));
    }
  }

  async signin(req, res) {
    const jwtSecret = "hola"; // Cambia esto por una clave secreta más segura
    const jwtExpiresIn = "1h"; // Expiración del token (1 hora en este caso)

    try {
      // Buscar al usuario en la base de datos
      const user = await User.findOne({ where: { email: req.body.email } });
      if (!user) {
        return res.status(401).json(Respuesta.error(null, "Invalid email"));
      }

      // Verificar la contraseña
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) {
        return res.status(401).send(Respuesta.error(null, "Invalid password"));
      }

      if (user.status === "blocked") {
        return res.status(401).send(Respuesta.error(null, "Your account is currently locked."));
      }

      // Crear un JWT
      const token = jwt.sign(
        { email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: jwtExpiresIn }
      );

      // Enviar el token y los datos del usuario
      const userData = { ...user.dataValues, password: "" };
      res.json(Respuesta.exito({ token: token, userData }, "User signin OK"));
    } catch (error) {
      logMensaje(error);
      res
        .status(500)
        .json(Respuesta.error(null, "Internal Server Error at signin process"));
    }
  }

  async createUser(req, res) {
    // Implementa la lógica para crear un nuevo user

    // Recuperar objeto con el user a dar de alta
    const userData = req.body;

    const saltRounds = 10; // Número de rondas
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    // Password hasheada
    userData.password = hashedPassword;

    try {
      const userInsertado = await User.create(userData);
      if (userInsertado) {
        // No devolver password encriptada por seguridad
        userInsertado.password = "";
        res.json(Respuesta.exito(userInsertado, "User created"));
      }
    } catch (error) {
      logMensaje(error);
      res.status(500).json(Respuesta.error(null, "Error creating user"));
    }
  }

  async updateUserStatus(req, res) {
    // Implementa la lógica para actualizar un user por su id
    // Recuperar información que vienen en la ruta '/:id'
    const { user_id } = req.params;
    const { status } = req.body;

    try {
      await User.update(
        { status: status }, // Los campos que deseas actualizar
        { where: { user_id: user_id } } // La condición para encontrar el registro
      );
      res.json(Respuesta.exito(null, "Status updated successfully"));

    } catch (error) {
      console.error("Error updating status:", error);
      res
        .status(500)
        .json(Respuesta.error(null, "Error updating status:" + error));
    }

  }

  async updateUserProfile(req, res) {
    // Implementa la lógica para actualizar un user por su id
    // Recuperar información que vienen en la ruta '/:id'
    const { user_id } = req.params;
    const { first_name, last_name, password } = req.body;

    try {

      if (password) {
        const saltRounds = 10; // Número de rondas
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await User.update(
          { first_name: first_name, last_name: last_name, password: hashedPassword }, // Los campos que deseas actualizar
          { where: { user_id: user_id } } // La condición para encontrar el registro
        );

      } else {
        await User.update(
          { first_name: first_name, last_name: last_name }, // Los campos que deseas actualizar
          { where: { user_id: user_id } } // La condición para encontrar el registro
        );
      }

      res.json(Respuesta.exito(null, "Profile updated successfully"));

    } catch (error) {
      console.error("Error updating profile:", error);
      res
        .status(500)
        .json(Respuesta.error(null, "Error updating profile:" + error));
    }

  }

  async deleteUser(req, res) {
    // Implementa la lógica para eliminar un user por su id
    // Recuperar información que vienen en la ruta '/:id'
    const iduser = req.params.id;
  }
}

module.exports = new UserController();
// Estructura de result (mysql)
// {
//   fieldCount: 0,
//   affectedRows: 1, // Número de filas afectadas por la consulta
//   insertId: 1,    // ID generado por la operación de inserción
//   serverStatus: 2,
//   warningCount: 0,
//   message: '',
//   protocol41: true,
//   changedRows: 0  // Número de filas cambiadas por la consulta
// }
