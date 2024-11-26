// eventRoutes.js
const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const multer = require("multer");
const path = require("path");

// Configuración de multer para almacenar archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets/images/events"); // Carpeta donde se guardarán las imágenes de eventos
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname); // Nombre único
    cb(null, uniqueName);
  },
});

// Configurar multer para aceptar múltiples archivos
const upload = multer({ storage: storage });

router.get("/", eventController.getAllEvent);
router.get("/next-events", eventController.getNextEvents);
router.get("/search", eventController.searchEvents);
router.get("/:id", eventController.getEventById);
router.post("/", upload.array("images", 10), eventController.createEvent);
router.patch("/:event_id", eventController.updateEventStatus);

// router.put("/:id", eventController.updateEvent);
// router.delete("/:id", eventController.deleteEvent);

module.exports = router;
