const jobService = require("../../services/yohan/jobService");

// Create a new job
exports.createJob = async (req, res) => {
  try {
    const newJob = await jobService.createJob(req.body);
    res.status(201).json(newJob);
  } catch (error) {
    console.log("Error creating job: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

//Get a specific job by its id
exports.getJobById = async (req, res) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.status(200).json(job);
  } catch (error) {
    console.log("Error getting job by id: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all jobs for a specific job owner
exports.getJobsForJobOwner = async (req, res) => {
  try {
    const jobs = await jobService.getJobsForJobOwner(req.params.email);
    res.status(200).json(jobs);
  } catch (error) {
    console.log("Error getting jobs for job owner: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Accept a specific bidder's bid amount and reject all other bidders' bids
exports.acceptBidForJob = async (req, res) => {
  try {
    const updatedJob = await jobService.acceptBidForJob(
      req.body.jobId,
      req.body.bidderId
    );
    res.status(200).json(updatedJob);
  } catch (error) {
    console.log("Error accepting bid for job: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all pending jobs for a specific service provider
exports.getPendingJobsForServiceProvider = async (req, res) => {
  try {
    const jobs = await jobService.getPendingJobsForServiceProvider(
      req.params.email
    );
    res.status(200).json(jobs);
  } catch (error) {
    console.log(
      "Error getting pending jobs for service provider: ",
      error.message
    );
    res.status(500).json({ message: error.message });
  }
};

// Update bidder's bid amount, bid description
exports.updateBidForJob = async (req, res) => {
  try {
    const updatedJob = await jobService.updateBidForJob(
      req.params.email,
      req.body.jobId,
      req.body.bidAmount,
      req.body.bidDescription
    );
    res.status(200).json(updatedJob);
  } catch (error) {
    console.log("Error updating bid for job: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all jobs for a specific service serviceProvider
exports.getJobsForServiceProvider = async (req, res) => {
  try {
    const jobs = await jobService.getJobsForServiceProvider(req.params.email);
    res.status(200).json(jobs);
  } catch (error) {
    console.log("Error getting jobs for service provider: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all accepted jobs for a specific service provider
exports.getAcceptedJobsForServiceProvider = async (req, res) => {
  try {
    const jobs = await jobService.getAcceptedJobsForServiceProvider(
      req.params.email
    );
    res.status(200).json(jobs);
  } catch (error) {
    console.log(
      "Error getting accepted jobs for service provider: ",
      error.message
    );
    res.status(500).json({ message: error.message });
  }
};
