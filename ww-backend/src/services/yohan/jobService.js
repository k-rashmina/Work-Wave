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

  async getPendingJobsForServiceProvider(email) {
    try {
      const serviceProvider = await userDataAccess.getUserByEmail(email);

      if (!serviceProvider || !serviceProvider._id) {
        throw new Error("Service provider not found");
      }

      const jobs = await jobDataAccess.getPendingJobsForServiceProvider(
        serviceProvider._id
      );
      return jobs;
    } catch (error) {
      throw new Error(
        console.log(
          "Error getting pending jobs for service provider: ",
          error.message
        ),
        `Error occurred while getting pending jobs for service provider: ${error.message}`
      );
    }
  }

  async getJobsForServiceProvider(email) {
    try {
      const serviceProvider = await userDataAccess.getUserByEmail(email);

      if (!serviceProvider || !serviceProvider._id) {
        throw new Error("Service provider not found");
      }

      const jobs = await jobDataAccess.getJobsForServiceProvider(
        serviceProvider._id
      );
      return jobs;
    } catch (error) {
      throw new Error(
        console.log("Error getting jobs for service provider: ", error.message),
        `Error occurred while getting jobs for service provider: ${error.message}`
      );
    }
  }

  async handleExpiredJobs() {
    try {
      const updatedJobs = await jobDataAccess.updatePendingJobsToOnGoing();
      return updatedJobs;
    } catch (error) {
      throw new Error(
        console.log("Error handling expired jobs: ", error.message),
        `Error occurred while handling expired jobs: ${error.message}`
      );
    }
  }

  async getAcceptedJobsForServiceProvider(email) {
    try {
      const serviceProvider = await userDataAccess.getUserByEmail(email);

      if (!serviceProvider || !serviceProvider._id) {
        throw new Error("Service provider not found");
      }

      const jobs = await jobDataAccess.getAcceptedJobsForServiceProvider(
        serviceProvider._id
      );
      return jobs;
    } catch (error) {
      throw new Error(
        console.log(
          "Error getting accepted jobs for service provider: ",
          error.message
        ),
        `Error occurred while getting accepted jobs for service provider: ${error.message}`
      );
    }
  }

  async updateBidForJob(email, jobId, bidAmount, bidDescription) {
    const serviceProvider = await userDataAccess.getUserByEmail(email);

    if (!serviceProvider || !serviceProvider._id) {
      throw new Error("Service provider not found");
    }

    const bidderId = serviceProvider._id;

    try {
      const updatedJob = await jobDataAccess.updateBidForJob(
        jobId,
        bidderId,
        bidAmount,
        bidDescription
      );
      return updatedJob;
    } catch (error) {
      throw new Error(
        console.log("Error updating bid for job: ", error.message),
        `Error occurred while updating bid for job: ${error.message}`
      );
    }
  }
}

module.exports = new JobService();
