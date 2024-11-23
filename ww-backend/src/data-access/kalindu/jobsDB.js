const mongoose = require("mongoose");
const jobs = require("../../models/kalindu/jobs");
const users = require("../../models/chamath/userModel");

//db function for creating a job
const createJob = async (jobDetails) => {
  try {
    //saving job details
    const newJob = new jobs(jobDetails);

    // console.log("newJob", newJob);

    await newJob.save();

    return true;
  } catch (err) {
    console.log(err.message);
  }
};

//db function for creating a job
const getNearbyWorkers = async (cusDetails) => {
  try {
    // console.log("cusDetails", cusDetails);
    //saving job details
    const nearbyWorkers = users.find(
      { serviceProvider: true, category: cusDetails.jobCategory },
      "email firstName lastName address location category availableDays experience profileImageURL rating"
    );

    return nearbyWorkers;
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { createJob, getNearbyWorkers };
