// userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAllUser);
router.get("/:id", userController.getUserById);
router.post("/signup", userController.createUser);
router.post("/signin", userController.signin);
router.patch("/:user_id", userController.updateUserStatus);
router.put("/:user_id", userController.updateUserProfile);
// router.delete("/:id", userController.deleteUser);

module.exports = router;
