const User = require("../../models/chamath/userModel");
const AssignedWorker = require("../../models/kalindu/jobs"); 


const getJobsData = async (req, res) => {
  try {
    
    const user = await User.findOne({ email: req.params.email });

    if (!user) {
      return res.status(404).json({ message: "Worker not found" });
    }

   
    const jobs = await AssignedWorker.find({
      workerId: user._id, 
      jobStatus: { $in: ['onGoing', 'pending'] }, 
    })
    .populate({
      path: "jobOwner", 
      model: "User",     
      select: "firstName lastName telephone category address", 
    });

    // Check if any jobs are found
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No onGoing or pending jobs found for this worker." });
    }

    // Respond with the jobs and populated jobOwner data
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs by status and email:", error);
    res.status(500).json({ message: "An error occurred while fetching jobs." });
  }
};

// Export the controller using module.exports
module.exports = { getJobsData };
