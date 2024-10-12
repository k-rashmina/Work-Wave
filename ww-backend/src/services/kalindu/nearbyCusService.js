const { getNearbyWorkers } = require("../../data-access/kalindu/jobsDB");
const { getClosestWorkers } = require("../../services/kalindu/locationService");

//service function to create customer job
const getNearbyCusService = async (cusDetails) => {
  const nearbyWorkers = await getNearbyWorkers(cusDetails);
  // console.log("nearbyWorkers[0]", nearbyWorkers.length);

  const nearbyWorkerDetails = getClosestWorkers(cusDetails, nearbyWorkers);

  return nearbyWorkerDetails;
};

module.exports = {
  getNearbyCusService,
};
