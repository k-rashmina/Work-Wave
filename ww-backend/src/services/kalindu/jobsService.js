const { createJob } = require("../../data-access/kalindu/jobsDB");
const { Client } = require("@googlemaps/google-maps-services-js");

const client = new Client({});

//service function to create customer job
const createJobService = async (jobDetails) => {
  const status = await createJob(jobDetails);

  return status;
};

module.exports = {
  createJobService,
};
