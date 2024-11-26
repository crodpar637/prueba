// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const { User } = require("../models"); // Ajusta la ruta según tu estructura de proyecto

const secretKey = "your_jwt_secret_key"; // Asegúrate de que esta clave sea segura

// Middleware para verificar el token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.sendStatus(401); // Unauthorized

    // Verificar el token
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });

    // Opcional: Verificar el usuario en la base de datos si es necesario
    const dbUser = await User.findByPk(decoded.id);
    if (!dbUser) return res.sendStatus(401); // Unauthorized

    req.user = dbUser;
    next();
  } catch (err) {
    console.error("Token verification failed", err);
    res.sendStatus(403); // Forbidden
  }
};

// Middleware para verificar el rol
const authorizeRole = (roles) => {
  return async (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.sendStatus(403); // Forbidden
    }
  };
};

module.exports = { authenticateToken, authorizeRole };
