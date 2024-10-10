const jobModel = require("../../models/kalindu/jobs");
const { ConvertTimeToUTC } = require("../../util/timeUtil");

class JobDataAccess {
  // Create a new job
  async createJob(job) {
    const newJob = await jobModel.create(job);
    return newJob;
  }

  // Get all jobs for a specific job owner
  async getJobsForJobOwner(jobOwnerId) {
    const jobs = await jobModel.find({
      jobOwnerId: jobOwnerId,
    });
    return jobs;
  }

  //Accept a specific bidder's bod amount and reject all other bidders' bids
  async acceptBidForJob(jobId, bidderId) {
    const job = await jobModel.findById(jobId);

    if (!job) {
      throw new Error("Job not found");
    }

    let selectedBid = job.bidders.find(
      (bidder) => bidder.bidderId.toString() === bidderId.toString()
    );

    if (!selectedBid) {
      throw new Error("Bidder not found for this job");
    }

    job.workerId = bidderId;
    job.bidAmount = selectedBid.bidAmount;

    job.bidders.forEach((bidder) => {
      if (bidder.bidderId.toString() === bidderId.toString()) {
        bidder.bidStatus = "accepted";
      } else {
        bidder.bidStatus = "rejected";
      }
    });

    const updatedJob = await job.save();
    return updatedJob;
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
