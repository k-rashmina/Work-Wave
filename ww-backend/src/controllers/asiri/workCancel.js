const AssignedWorker = require("../../models/kalindu/jobs"); // Import the job model

// Cancel a worker's assignment
const cancelWork = async (req, res) => {
  const { workerId, assignmentId } = req.body; // Extract workerId and assignmentId from the request body

  try {
    // Fetch the existing assignment using the assignmentId (_id)
    const existingAssignment = await AssignedWorker.findById(assignmentId);
    if (!existingAssignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    // Check if the workerId matches the assignment's workerId
    if (existingAssignment.workerId.toString() !== workerId) {
      return res
        .status(403)
        .json({ message: "Worker is not assigned to this job." });
    }

    // Update the jobStatus to 'rejected'
    existingAssignment.jobStatus = "rejected";

    // Save the updated assignment back to the database
    await existingAssignment.save();

    // Respond with success and the updated assignment
    return res
      .status(200)
      .json({
        message: "Assignment canceled successfully",
        job: existingAssignment,
      });
  } catch (error) {
    console.error("Error canceling assignment:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while canceling the assignment." });
  }
};

// Export the controller using module.exports
module.exports = {
  cancelWork,
};
