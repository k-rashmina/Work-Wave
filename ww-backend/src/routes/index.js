const express = require("express");
// const path = require("path");

const userRoutes = require("./userRoutes");
const sheduleRoutes = require("./sheduleRoutes");

const router = express.Router();

router.use("/user", userRoutes);
router.use("/shedule", sheduleRoutes);

router.get("/test", (req, res) => {
  res.status(200).json({
    message1: "Hello World",
    message2: "my name kalindu rashmina",
  });
});

module.exports = router;
