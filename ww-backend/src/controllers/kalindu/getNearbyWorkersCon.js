const {
  getNearbyCusService,
} = require("../../services/kalindu/nearbyCusService");

const getNearbyWorkersCon = async (req, res) => {
  try {
    let cusDetails = req.query.cusDetails;
    cusDetails = JSON.parse(cusDetails);
    // console.log("cusCon", cusDetails.jobLocation);

    res.status(200).json(await getNearbyCusService(cusDetails));
  } catch (e) {
    console.log("Error occurred in getNearbyWorkersCon: ", e);
    res.status(500).send("Error occurred");
  }
};

module.exports = getNearbyWorkersCon;
