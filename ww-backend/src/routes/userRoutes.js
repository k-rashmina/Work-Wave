const express = require("express");
const router = express.Router();
const userController = require("../controllers/chamath/userController");

router.post("/create", userController.createUser);
router.get("/get/:email", userController.getUser);
router.put("/update/:email", userController.updateUser);
router.delete("/delete/:email", userController.deleteUser);
router.get("/getAll", userController.getAllUsers);

module.exports = router;
