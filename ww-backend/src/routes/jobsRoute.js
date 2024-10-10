const express = require("express");
const router = express.Router();

const createJobController = require("../controllers/kalindu/jobsController");
const jobController = require("../controllers/yohan/jobController");

router.post("/createjob", (req, res) => createJobController(req, res));

router.get("/jsp/:email", (req, res) =>
  jobController.getJobsForServiceProvider(req, res)
);

router.get("/jsp/pending/:email", (req, res) =>
  jobController.getPendingJobsForServiceProvider(req, res)
);

router.get("/jsp/accepted/:email", (req, res) =>
  jobController.getAcceptedJobsForServiceProvider(req, res)
);

router.put("/jsp/:email", (req, res) =>
  jobController.updateBidForJob(req, res)
);

module.exports = router;
