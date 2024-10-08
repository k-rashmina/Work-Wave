const express = require("express");
const router = express.Router();


const sheduleController = require('../controllers/asiri/assignedWorker');


router.post('/assign-worker/:workerId', sheduleController.assignWorkerWithNextAvailableDate);

module.exports = router;