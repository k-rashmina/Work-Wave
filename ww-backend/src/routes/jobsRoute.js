const express = require("express");
const router = express.Router();

const createJobController = require("../controllers/kalindu/jobsController");

router.post("/createjob", (req, res) => createJobController(req, res));

module.exports = router;
