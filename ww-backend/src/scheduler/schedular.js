const cron = require("node-cron");
const jobService = require("../services/yohan/jobService");

const updateJobStatus = async () => {
  cron.schedule("* * * * *", async () => {
    try {
      console.log("Searching for expired jobs...");
      await jobService.handleExpiredJobs();
    } catch (error) {
      console.log("Error updating job status: ", error.message);
    }
  });
};

module.exports = updateJobStatus;
