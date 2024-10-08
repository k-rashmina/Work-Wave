const express = require("express");
const router = express.Router();


const sheduleController = require('../controllers/asiri/assignedWorker');
const reSheduleController = require('../controllers/asiri/resheduleController');
const availabilityUpdate = require('../controllers/asiri/availabilityUpdate');


router.post('/assign-worker/:workerId', sheduleController.assignWorkerWithNextAvailableDate);
router.put('/reschedule-worker', reSheduleController.rescheduleWorkerAssignment);
router.put('/update-available-days/:userId', availabilityUpdate.updateAvailableDays);


module.exports = router;