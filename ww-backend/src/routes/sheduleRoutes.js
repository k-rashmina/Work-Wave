const express = require("express");
const router = express.Router();


const sheduleController = require('../controllers/asiri/assignedWorker');
const reSheduleController = require('../controllers/asiri/resheduleController');
const availabilityUpdate = require('../controllers/asiri/availabilityUpdate');
const availabilityGet = require('../controllers/asiri/getAvailability');

router.post('/assign-worker/:workerId', sheduleController.assignWorkerWithNextAvailableDate);
router.put('/reschedule-worker', reSheduleController.rescheduleWorkerAssignment);
router.put('/update-available-days/:email', availabilityUpdate.updateAvailableDays);
router.get('/get-available-days/:email', availabilityGet.getUserAvailability);



module.exports = router;