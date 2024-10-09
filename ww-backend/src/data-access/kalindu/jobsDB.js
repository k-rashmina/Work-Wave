const mongoose = require("mongoose");
const jobs = require("../../models/kalindu/jobs");

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

module.exports = { createJob };
