const jobModel = require("../../models/kalindu/jobs");
const { ConvertTimeToUTC } = require("../../util/timeUtil");

class JobDataAccess {
  // Create a new job
  async createJob(job) {
    const newJob = await jobModel.create(job);
    return newJob;
  }

  //Get pending jobs for a specific service provider
  async getPendingJobsForServiceProvider(serviceProviderId) {
    const currentTime = ConvertTimeToUTC(new Date());
    const jobs = await jobModel.find({
      "bidders.bidderId": serviceProviderId,
      jobStatus: "pending",
      bidClosingAt: { $gt: currentTime },
    });
    return jobs;
  }

  // Get all jobs for a specific service provider
  async getJobsForServiceProvider(serviceProviderId) {
    const jobs = await jobModel.find({
      "bidders.bidderId": serviceProviderId,
    });
    return jobs;
  }

  // Get all accepted jobs for a specific service provider
  async getAcceptedJobsForServiceProvider(serviceProviderId) {
    const jobs = await jobModel.find({
      "bidders.bidderId": serviceProviderId,
      "bidders.bidStatus": "accepted",
    });
    return jobs;
  }

  //Update bidder's bid amount , bid description and bid status
  async updateBidForJob(jobId, bidderId, bidAmount, bidDescription) {
    const updatedJob = await jobModel.findOneAndUpdate(
      {
        _id: jobId,
        "bidders.bidderId": bidderId,
      },
      {
        $set: {
          "bidders.$.bidAmount": bidAmount,
          "bidders.$.bidDescription": bidDescription,
          "bidders.$.bidStatus": "pending",
        },
      },
      { new: true }
    );
    return updatedJob;
  }

  // update job status to "onGoing" for all jobs where bidClosingAt has passed
  async updatePendingJobsToOnGoing() {
    const currentTime = ConvertTimeToUTC(new Date());

    // Find all jobs where bidClosingAt has passed and jobStatus is still "pending"
    const jobsToUpdate = await jobModel.find({
      jobType: "bid",
      jobStatus: "pending",
      bidClosingAt: { $lt: currentTime },
    });

    if (jobsToUpdate.length === 0) {
      console.log("No expired jobs found. All jobs are up to date");
      return [];
    } else {
      // Update jobStatus to "onGoing" for all jobs found
      const updatedJobs = await jobModel.updateMany(
        {
          _id: { $in: jobsToUpdate.map((job) => job._id) },
        },
        {
          jobStatus: "onGoing",
        }
      );
      console.log("Expired Jobs are found. Job status updated successfully");
      return updatedJobs;
    }
  }
}

module.exports = new JobDataAccess();
