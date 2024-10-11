const jobDataAccess = require("../../data-access/yohan/jobDataAcess");
const userDataAccess = require("../../data-access/chamath/userDataAccess");

class JobService {
  //Create a new job
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

  //Get a specific job by its id
  async getJobById(jobId) {
    try {
      const job = await jobDataAccess.getJobById(jobId);
      return job;
    } catch (error) {
      throw new Error(
        console.log("Error getting job by id: ", error.message),
        `Error occurred while getting job by id: ${error.message}`
      );
    }
  }

  //Get all jobs for a specific job owner
  async getJobsForJobOwner(email) {
    try {
      const jobOwner = await userDataAccess.getUserByEmail(email);

      if (!jobOwner || !jobOwner._id) {
        throw new Error("Job owner not found");
      }

      const jobs = await jobDataAccess.getJobsForJobOwner(jobOwner._id);
      return jobs;
    } catch (error) {
      throw new Error(
        console.log("Error getting jobs for job owner: ", error.message),
        `Error occurred while getting jobs for job owner: ${error.message}`
      );
    }
  }

  //Accept a specific bidder's bid amount and reject all other bidders' bids
  async acceptBidForJob(jobId, bidderId) {
    try {
      const updatedJob = await jobDataAccess.acceptBidForJob(jobId, bidderId);
      return updatedJob;
    } catch (error) {
      throw new Error(
        console.log("Error accepting bid for job: ", error.message),
        `Error occurred while accepting bid for job: ${error.message}`
      );
    }
  }

  //Get all pending jobs for a specific service provider
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

  //Update bidder's bid amount, bid description
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

  //Get all jobs for a specific service provider
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

  //Get all accepted jobs for a specific service provider
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

  //Handle expired jobs
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
}

module.exports = new JobService();
