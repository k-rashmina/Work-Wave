const jobDataAccess = require("../../data-access/yohan/jobDataAcess");
const userDataAccess = require("../../data-access/chamath/userDataAccess");

class JobService {
  async createJob(job) {
    try {
      const newJob = await jobDataAccess.createJob(job);
      return newJob;
    } catch (error) {
      throw new Error(
        console.log("Error creating job: ", error.message),
        `Error occurred while creating new job: ${error.message}`
      );
    }
  }

  async getJobsForServiceProvider(email) {
    try {
      const serviceProvide = await userDataAccess.getUserByEmail(email);

      if (!serviceProvide || !serviceProvide._id) {
        throw new Error("Service provider not found");
      }

      const jobs = await jobDataAccess.getJobsForServiceProvider(
        serviceProvide._id
      );
      return jobs;
    } catch (error) {
      throw new Error(
        console.log("Error getting jobs for service provider: ", error.message),
        `Error occurred while getting jobs for service provider: ${error.message}`
      );
    }
  }
}

module.exports = new JobService();
