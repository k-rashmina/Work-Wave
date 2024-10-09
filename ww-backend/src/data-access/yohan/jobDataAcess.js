const jobModel = require("../../models/yohan/jobModel");
const { ConvertTimeToUTC } = require("../../util/timeUtil");

class JobDataAccess {
  // Create a new job
  async createJob(job) {
    const newJob = await jobModel.create(job);
    return newJob;
  }

  // Get all jobs for a service provider
  async getJobsForServiceProvider(serviceProviderId) {
    const jobs = await jobModel.find({
      "jobServiceProvider.serviceProvider": serviceProviderId,
    });
    return jobs;
  }

  // Find jobs where bidClosingAt has passed and jobStatus is still "open"
  async closeExpiredJobs() {
    const currentTime = ConvertTimeToUTC(new Date());
    const jobsToClose = await jobModel.find({
      jobType: "bid",
      jobStatus: "bidOpen",
      bidClosingAt: { $lt: currentTime },
    });
  }
}

module.exports = new JobDataAccess();
