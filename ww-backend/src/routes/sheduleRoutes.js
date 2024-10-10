const express = require("express");
const router = express.Router();


const sheduleController = require('../controllers/asiri/assignedWorker');
const reSheduleController = require('../controllers/asiri/resheduleController');
const availabilityUpdate = require('../controllers/asiri/availabilityUpdate');
const availabilityGet = require('../controllers/asiri/getAvailability');
const getsheduledDates = require('../controllers/asiri/getSheduledData');
const getsortedData = require('../controllers/asiri/sorterdSheduledData');

router.post('/assign-worker/:workerId', sheduleController.assignWorkerWithNextAvailableDate);
router.put('/reschedule-worker', reSheduleController.rescheduleWorkerAssignment);
router.put('/update-available-days/:email', availabilityUpdate.updateAvailableDays);
router.get('/get-available-days/:email', availabilityGet.getUserAvailability);
router.get('/get-scheduled-dates/:email', getsheduledDates.getAssignedDates);
router.get('/get-sorted-data/:email',getsortedData.getSortedData);



module.exports = router;