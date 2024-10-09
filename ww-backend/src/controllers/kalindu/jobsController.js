const { createJobService } = require("../../services/kalindu/jobsService");

const createJobController = async (req, res) => {
  try {
    const jobDetails = req.body;

    res.status(200).json(await createJobService(jobDetails));
  } catch (e) {
    console.log("Error occurred in createJobController: ", e);
    res.status(500).send("Error occurred");
  }
};

module.exports = createJobController;
