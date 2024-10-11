const express = require("express");
const router = express.Router();


const sheduleController = require('../controllers/asiri/assignedWorker');
const reSheduleController = require('../controllers/asiri/resheduleController');
const availabilityUpdate = require('../controllers/asiri/availabilityUpdate');
const availabilityGet = require('../controllers/asiri/getAvailability');
const getsheduledDates = require('../controllers/asiri/getSheduledData');
const getsortedData = require('../controllers/asiri/sorterdSheduledData');
const cancelWork = require('../controllers/asiri/workCancel');
const getJobsByStatus = require('../controllers/asiri/getWorkCancelData');
const getNextAvailableDate = require('../controllers/asiri/getAvalilableDate');

router.post('/assign-worker/:workerId', sheduleController.assignWorkerWithNextAvailableDate);
router.put('/reschedule-worker', reSheduleController.rescheduleWorkerAssignment);
router.put('/update-available-days/:email', availabilityUpdate.updateAvailableDays);
router.get('/get-available-days/:email', availabilityGet.getUserAvailability);
router.get('/get-scheduled-dates/:email', getsheduledDates.getAssignedDates);
router.get('/get-sorted-data/:email',getsortedData.getSortedData);
router.put('/cancel-work/',cancelWork.cancelWork);
router.get('/get-workdata-bystatus/:email',getJobsByStatus.getJobsData);
router.get('/get-next-available-date/:workerId', getNextAvailableDate.getNextAvailableDate);  //for get the next available date for a worker



module.exports = router;