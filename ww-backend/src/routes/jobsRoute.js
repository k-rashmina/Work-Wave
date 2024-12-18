const express = require("express");
const router = express.Router();

const createJobController = require("../controllers/kalindu/jobsController");
const getNearbyWorkersCon = require("../controllers/kalindu/getNearbyWorkersCon");
const jobController = require("../controllers/yohan/jobController");

router.post("/createjob", (req, res) => createJobController(req, res));

router.get("/jspo/:id", (req, res) => jobController.getJobById(req, res));

router.get("/jo/:email", (req, res) =>
  jobController.getJobsForJobOwner(req, res)
);

router.put("/jo/accept", (req, res) => jobController.acceptBidForJob(req, res));

router.get("/jsp/pending/:email", (req, res) =>
  jobController.getPendingJobsForServiceProvider(req, res)
);


router.get("/nearbyworkers", (req, res) => getNearbyWorkersCon(req, res));
router.put("/jsp/:email", (req, res) =>
  jobController.updateBidForJob(req, res)
);

router.get("/jsp/:email", (req, res) =>
  jobController.getJobsForServiceProvider(req, res)
);

router.get("/jsp/accepted/:email", (req, res) =>
  jobController.getAcceptedJobsForServiceProvider(req, res)
);

module.exports = router;
